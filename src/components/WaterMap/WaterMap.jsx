import React, { useState, useRef, useEffect } from 'react'; 
import styles from './WaterMap.module.css';
import { supabase } from '../../supabaseClient';

const WaterMap = () => {
  const [elements, setElements] = useState([]);
  const [soundUrls, setSoundUrls] = useState([]); 
  const fileInputRef = useRef(null);
  const activeAudiosRef = useRef(new Map()); // To store active Audio objects
  const lastPlayedSoundUrlRef = useRef(null); // To keep track of the last played sound

  useEffect(() => {
    const fetchSounds = async () => {
      const { data } = await supabase.storage.from('sounds').list();
      if (data) {
        // 過濾掉隱藏的佔位檔，只保留真正的音檔
        const filteredData = data.filter(file => file.name !== '.emptyFolderPlaceholder');
        const urls = filteredData.map(file => 
          supabase.storage.from('sounds').getPublicUrl(file.name).data.publicUrl
        );
        setSoundUrls(urls);
      }
    };
    fetchSounds();
  }, []);

  const handleClick = (e) => {
    if (e.clientY < window.innerHeight * 0.4) return;
    if (e.target.closest(`.${styles.uploadBar}`)) return;

    const { clientX: x, clientY: y } = e;
    const id = Date.now();

    // Store a reference to the audio object if played
    let currentAudio = null;
    if (soundUrls.length > 0) {
      let randomUrl;
      // Loop to ensure a different sound is played if possible
      do {
        randomUrl = soundUrls[Math.floor(Math.random() * soundUrls.length)];
      } while (soundUrls.length > 1 && randomUrl === lastPlayedSoundUrlRef.current);
      
      lastPlayedSoundUrlRef.current = randomUrl; // Update last played sound

      currentAudio = new Audio(randomUrl);
      currentAudio.volume = 0.6;
      currentAudio.play().catch(() => console.log("等待初次互動後播放"));
      activeAudiosRef.current.set(id, currentAudio); // Store audio with ripple ID
    }

    // 新增水波
    setElements((prev) => [...prev, { id, x, y }]);

    // 移除水波並停止聲音 (8秒後)
    setTimeout(() => {
      setElements((prev) => prev.filter(el => el.id !== id));
      
      const audioToStop = activeAudiosRef.current.get(id);
      if (audioToStop) {
        audioToStop.pause(); // Stop playback
        audioToStop.currentTime = 0; // Reset playback position
        activeAudiosRef.current.delete(id); // Remove from map
      }
    }, 8000);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      alert("正在將聲音移至水溝中 (Supabase)...");
      
      // Use the original filename directly.
      // Consider sanitizing 'file.name' in a real application to handle special characters or potential security issues.
      const fileName = file.name;

      // Create a Blob from the file content.
      const blob = new Blob([file], { type: file.type });

      const SUPABASE_URL = 'https://xwgwznsihjbkiseozfnx.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Z3d6bnNpaGpia2lzZW96Zm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTEzNDEsImV4cCI6MjA4NTg2NzM0MX0.GDlSjzgFobhsOAOsXlglEMkscbe3lPR4QtZpidliyJA'; // ACTUAL Supabase Anon Key

      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/sounds/${fileName}`;

      const response = await fetch(uploadUrl, {
        method: 'POST', // For new uploads
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': blob.type, // Explicitly set content type
        },
        body: blob,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase upload failed: ${response.status} - ${errorText}`);
      }

      // Supabase's direct upload does not return the public URL directly,
      // so we construct it.
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/sounds/${fileName}`;
      
      setSoundUrls(prev => [...prev, publicUrl]);
      alert("上傳成功！這段聲音已永久留在 nos.ar.radio。");

    } catch (error) {
      console.error("上傳失敗：", error.message);
      alert("上傳失敗，請確認 Supabase 權限或檔案格式。");
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
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".mp3, .wav" onChange={handleFileChange} />
        <div className={styles.uploadBar} onClick={handleUploadButtonClick}>
          <span className={styles.uploadText}>UPLOAD AUDIO</span>
          <div className={styles.uploadIcon}>☂</div>
        </div>
      </div>
    </div>
  );
};

export default WaterMap;