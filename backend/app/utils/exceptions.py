from fastapi import HTTPException, status
from pydantic import ValidationError


class InventoryException(Exception):
    """Base exception for inventory operations"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class InsufficientStockException(InventoryException):
    """Raised when stock is insufficient"""
    pass


class DuplicateEntryException(InventoryException):
    """Raised when trying to create duplicate entries"""
    pass


class ResourceNotFoundException(InventoryException):
    """Raised when a resource is not found"""
    pass


class InvalidDataException(InventoryException):
    """Raised when data validation fails"""
    pass


def handle_inventory_exception(exc: InventoryException):
    """Convert inventory exceptions to HTTP responses"""
    if isinstance(exc, DuplicateEntryException):
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=exc.message
        )
    elif isinstance(exc, InsufficientStockException):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=exc.message
        )
    elif isinstance(exc, ResourceNotFoundException):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc.message
        )
    elif isinstance(exc, InvalidDataException):
        return HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=exc.message
        )
    else:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def format_validation_errors(errors: list) -> dict:
    """Format pydantic validation errors"""
    formatted_errors = []
    for error in errors:
        formatted_errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    return {"errors": formatted_errors}
