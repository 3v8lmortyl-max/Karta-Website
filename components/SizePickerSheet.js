'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';
import { formatINR } from '../lib/products';

export default function SizePickerSheet({ product, open, onClose, onConfirm }) {
  const sizes = product?.sizes && product.sizes.length ? product.sizes : ['One Size'];
  const [size, setSize] = useState(sizes[0]);

  useEffect(() => { if (open) setSize(sizes[0]); }, [open, product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay-scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} onClick={onClose}
          />
          <motion.div
            className="sizesheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
          >
            <div className="sizesheet-head">
              <div>
                <h3 className="sizesheet-title">{product.name}</h3>
                <p className="sizesheet-price">
                  {product.salePrice
                    ? (<><span className="price-sale">{formatINR(product.salePrice)}</span> <span className="price-was">{formatINR(product.price)}</span></>)
                    : formatINR(product.price)}
                </p>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
            </div>

            <p className="sizesheet-label">Size</p>
            <div className="sizesheet-sizes">
              {sizes.map((s) => (
                <button key={s} className={`sizesheet-size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>

            <button className="btn-solid sizesheet-cta" onClick={() => onConfirm(size)}>Add To Bag</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
