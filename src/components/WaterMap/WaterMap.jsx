import React, { useState, useRef } from 'react'; // 引入 useRef
import styles from './WaterMap.module.css';

const WaterMap = () => {
  const [elements, setElements] = useState([]);
  const fileInputRef = useRef(null); // 建立一個 Ref 來操作隱藏的 input

  const handleClick = (e) => {
    if (e.clientY < window.innerHeight * 0.4) return;
    if (e.target.closest(`.${styles.uploadBar}`)) return;

    const { clientX: x, clientY: y } = e;
    setElements((prev) => [...prev, { id: Date.now(), x, y }]);
  };

  // 點擊自訂按鈕時，觸發隱藏的 input
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  // 當使用者選好檔案後的處理邏輯
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("選取的檔案：", file.name);
      // 這裡可以加入你之後要上傳到 Firebase 的代碼
      alert(`已選取檔案：${file.name} (準備上傳到 nos.ar.radio)`);
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.giantHeader}>Nos ar radio</div>
      
      <div className={styles.stage3D}>
        {elements.map((el) => (
          <div key={el.id} className={styles.emitter} style={{ left: el.x, top: el.y }}>
            <div className={`${styles.ripple} ${styles.d1}`} />
            <div className={`${styles.ripple} ${styles.d2}`} />
            <div className={`${styles.ripple} ${styles.d3}`} />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        {/* 隱藏的檔案輸入框，限制只能選 mp3 和 wav */}
        <input 
          type="file" 
          ref={fileInputRef}
          style={{ display: 'none' }} 
          accept=".mp3, .wav"
          onChange={handleFileChange}
        />

        <div className={styles.uploadBar} onClick={handleUploadButtonClick}>
          <span className={styles.uploadText}>UPLOAD AUDIO</span>
          <div className={styles.uploadIcon}>☂</div>
        </div>
      </div>
    </div>
  );
};

export default WaterMap;