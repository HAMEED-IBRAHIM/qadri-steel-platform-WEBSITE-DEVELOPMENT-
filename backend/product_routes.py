
from fastapi import APIRouter, HTTPException
import psycopg2
import psycopg2.extras
from typing import List, Dict, Any

router = APIRouter(prefix="/products", tags=["Products"])

def get_db_connection():
    conn = psycopg2.connect(
        host="aws-0-ap-southeast-2.pooler.supabase.com",
        database="postgres",
        user="postgres.otjguqzlgzmyctgnznbt",
        password="Hameed7690#123",
        port=6543
    )
    return conn

@router.get("/")
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
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
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
