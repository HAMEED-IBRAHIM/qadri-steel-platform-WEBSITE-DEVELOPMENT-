
from fastapi import APIRouter, HTTPException
import sqlite3
from typing import List, Dict, Any

router = APIRouter(prefix="/products", tags=["Products"])

def get_db_connection():
    conn = sqlite3.connect("formulations.db")
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/")
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
def get_product(product_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
