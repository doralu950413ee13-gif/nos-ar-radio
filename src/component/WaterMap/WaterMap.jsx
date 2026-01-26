import React, { useState } from 'react';
import styles from './WaterMap.module.css';

const WaterMap = () => {
  const [ripples, setRipples] = useState([]);

  // 之後你可以將 Firebase 的連結放入此陣列
  const soundLibrary = [
    "https://actions.google.com/sounds/v1/water/sloshing_water.ogg" // 暫時測試音訊
  ];

  const handleClick = (e) => {
    const { clientX: x, clientY: y } = e;
    const id = Date.now();

    // 播放音效
    const audio = new Audio(soundLibrary[0]);
    audio.play().catch(() => console.log("等待互動以播放音訊"));

    // 記錄位置以產生漣漪
    setRipples((prev) => [...prev, { id, x, y }]);

    // 3秒後移除，保持 DOM 乾淨
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.uiText}>
        <h1>nos.ar.radio</h1>
        <p>來自他方的聲音，正在此處匯流</p>
      </div>
      
      {ripples.map((ripple) => (
        <React.Fragment key={ripple.id}>
          <div className={styles.soundPin} style={{ left: ripple.x, top: ripple.y }} />
          <div className={`${styles.ripple} ${styles.d1}`} style={{ left: ripple.x, top: ripple.y }} />
          <div className={`${styles.ripple} ${styles.d2}`} style={{ left: ripple.x, top: ripple.y }} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default WaterMap;