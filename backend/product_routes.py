
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


from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    brand: str
    price: float
    stock_status: str
    image: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    desc: Optional[str] = ""

@router.post("/")
def add_product(product: ProductCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO products (name, category, brand, price, stock_status, image, rating, reviews, "desc")
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (product.name, product.category, product.brand, product.price, product.stock_status, product.image, product.rating, product.reviews, product.desc)
        )
        new_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return {"id": new_id, **product.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}")
def update_product(product_id: int, product: ProductCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE products SET name=%s, category=%s, brand=%s, price=%s, stock_status=%s, image=%s, rating=%s, reviews=%s, "desc"=%s
               WHERE id=%s""",
            (product.name, product.category, product.brand, product.price, product.stock_status, product.image, product.rating, product.reviews, product.desc, product_id)
        )
        conn.commit()
        conn.close()
        return {"id": product_id, **product.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}")
def delete_product(product_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))
        conn.commit()
        conn.close()
        return {"deleted": product_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
