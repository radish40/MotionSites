"""Serve the built site at its configured subpath for local checks."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
from pathlib import Path

ROOT = Path(__file__).parent / 'dist'
PREFIX = '/motionsites-results/mood-tracker/'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlsplit(self.path).path.startswith(PREFIX):
            self.path = '/' + self.path[len(PREFIX):]
        super().do_GET()

ThreadingHTTPServer(('0.0.0.0', 4173), Handler).serve_forever()
