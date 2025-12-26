"""
QuickType Pro - Middleware Modülü
Güvenlik middleware'leri
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from .security import get_client_ip, check_rate_limit, log_connection
from .config import CSP_POLICY


class SecurityMiddleware(BaseHTTPMiddleware):
    """Güvenlik middleware'i - Rate limiting ve güvenlik başlıkları"""
    
    async def dispatch(self, request: Request, call_next):
        client_ip = get_client_ip(request)
        
        # Rate limiting kontrolü
        if not check_rate_limit(client_ip):
            log_connection(client_ip, "RATE_LIMITED", f"Path: {request.url.path}")
            return JSONResponse(
                status_code=429,
                content={"error": "Çok fazla istek. Lütfen bekleyin."}
            )
        
        # İsteği işle
        response = await call_next(request)
        
        # Güvenlik başlıkları ekle
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = CSP_POLICY
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        
        return response
