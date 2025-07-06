# Vercel serverless function wrapper
from server import app

# Export the Flask app as a Vercel function
def handler(request):
    return app(request.environ, lambda *args: None)