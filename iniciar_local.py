"""Local-only launcher. No Docker, tunnel, or public exposure."""
import os
import socket
import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path

def main():
    os.chdir(Path(__file__).parent)
    for port in (8000, 8080):
        with socket.socket() as probe:
            try:
                probe.bind(('127.0.0.1', port))
            except OSError:
                print(f'El puerto {port} ya esta ocupado. Cierra la otra instancia antes de iniciar este demo.')
                return 1
    processes = []
    try:
        for app, port in [('api', 8000), ('ui', 8080)]:
            processes.append(subprocess.Popen([sys.executable, '-m', 'uvicorn', f'app.{app}:app', '--host', '127.0.0.1', '--port', str(port)]))
        for _ in range(60):
            if any(p.poll() is not None for p in processes):
                raise RuntimeError('Uno de los servicios no pudo iniciar.')
            try:
                with urllib.request.urlopen('http://127.0.0.1:8080/health', timeout=1) as response:
                    ready = response.status == 200
                if ready:
                    break
            except (OSError, TimeoutError):
                pass
            time.sleep(.5)
        else:
            raise RuntimeError('No se pudo verificar la conexion entre interfaz y API.')
        print('\nDemo listo: http://localhost:8080\nUsuario:', os.environ.get('UI_USER', 'pimientero'))
        print('Usa la cuenta configurada en SQLite. La clave heredada solo se importa en la primera migracion.\nMantén esta ventana abierta. Para detener: Ctrl+C.\n', flush=True)
        if '--no-browser' not in sys.argv:
            webbrowser.open('http://localhost:8080')
        while all(p.poll() is None for p in processes):
            time.sleep(1)
    except KeyboardInterrupt:
        print('\nCerrando el demo...')
    except Exception as error:
        print(error)
        return 1
    finally:
        for process in processes:
            if process.poll() is None:
                process.terminate()
        for process in processes:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
