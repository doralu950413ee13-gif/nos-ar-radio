import React, { useState } from 'react';
import styles from './WaterMap.module.css';

const WaterMap = () => {
  const [elements, setElements] = useState([]);

  const handleClick = (e) => {
    // 限制：畫面垂直高度前 20% 不准點擊
    if (e.clientY < window.innerHeight * 0.2) return;
    
    // 避免點擊到 Upload Bar
    if (e.target.closest(`.${styles.uploadBar}`)) return;

    const { clientX: x, clientY: y } = e;
    const id = Date.now();
    setElements((prev) => [...prev, { id, x, y }]);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      {/* 放大且置中的標題，放在 stage3D 之外避免被壓扁 */}
      <div className={styles.giantHeader}>
        Nos ar radio
      </div>
      
      <div className={styles.stage3D}>
        {elements.map((el) => (
          <div 
            key={el.id} 
            className={styles.emitter} 
            style={{ 
              left: `${el.x}px`, 
              top: `${el.y}px`,
            }}
          >
            {/* 水波層 */}
            <div className={`${styles.ripple} ${styles.d1}`} />
            <div className={`${styles.ripple} ${styles.d2}`} />
            <div className={`${styles.ripple} ${styles.d3}`} />
            <div className={`${styles.ripple} ${styles.d4}`} />
            <div className={`${styles.ripple} ${styles.d5}`} />
            <div className={`${styles.ripple} ${styles.d6}`} />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.uploadBar}>
          <span className={styles.uploadText}>UPLOAD</span>
          <div className={styles.uploadIcon}>☂</div>
        </div>
      </div>
    </div>
  );
};

export default WaterMap;