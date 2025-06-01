import React, { useRef, useState, useEffect } from "react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export default function PalmAnalyzer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const [referenceBase64, setReferenceBase64] = useState("");

  // ✅ ✨ 컴포넌트 마운트 시 reference.png → base64로 변환
  useEffect(() => {
    fetch("/reference.png")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          setReferenceBase64(base64);
        };
        reader.readAsDataURL(blob);
      });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      analyzePalmWithOpenAI(base64);
    }
  };
  // 다시 선택 버튼
  const handleReselect = () => {
    setImageSrc(null);
    setResult("");
    fileInputRef.current.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // `data:image/...;base64,` 제거
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzePalmWithOpenAI = async (base64Image) => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "너는 손금 전문가야. 처음 reference 사진을 보고 해당 손바닥의 손금을 해석해줘",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "첫 번째 사진을 참고하여 두 번째 손 이미지를 해석해주세요.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/png;base64,${referenceBase64}`,
                    },
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/png;base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      setResult(content || "결과를 가져오지 못했습니다.");
    } catch (err) {
      console.error(err);
      setResult("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1209",
        minHeight: "100vh",
        padding: "60px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Noto Serif KR', serif",
        color: "#e8c28c",
      }}
    >
      {/* 개인정보 안내 */}
      <div
        style={{
          backgroundColor: "#3b2a1e",
          color: "#f3e0c0",
          padding: "16px 20px",
          borderRadius: "12px",
          marginBottom: "40px",
          border: "1px solid #9b7a58",
          maxWidth: "500px",
          fontSize: "14px",
        }}
      >
        <strong style={{ display: "block", marginBottom: "8px" }}>
          📢 개인정보 보호 안내
        </strong>
        업로드하신 이미지는 오직 로컬 기기에서만 처리되며, 외부 서버에도
        저장되지 않습니다.
      </div>

      {/* 타이틀 */}
      <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>
        손금은 이야기다
      </h1>
      <p style={{ marginBottom: "40px", fontSize: "16px" }}>
        AI가 당신의 손바닥에 담긴 운명을 읽어드립니다.
      </p>

      {/* 업로드 박스 */}
      <div
        style={{
          backgroundColor: "#2c1d13",
          border: "1px solid #a37135",
          borderRadius: "16px",
          padding: "40px 30px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
        }}
      >
        {!imageSrc ? (
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="upload"
            />
            <label
              htmlFor="upload"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#e8c28c",
                color: "#3c2e1d",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              손바닥 사진 업로드
            </label>
            <p style={{ fontSize: "14px", color: "#a78b6b" }}>
              5MB 이하의 이미지 파일
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                marginBottom: "20px",
              }}
            >
              <img
                src={imageSrc}
                alt="손바닥"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "15%",
                  width: "70%",
                  height: "70%",
                  border: "2px dashed #e8c28c",
                  borderRadius: "12px",
                }}
              />
            </div>
            <button
              onClick={handleReselect}
              style={{
                marginRight: "10px",
                background: "transparent",
                border: "2px solid #e8c28c",
                color: "#e8c28c",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              다시 선택
            </button>
          </>
        )}
      </div>

      {/* 분석 결과 */}
      {loading && (
        <p style={{ marginTop: "30px" }}>🔍 손금을 분석 중입니다...</p>
      )}
      {result && (
        <div
          style={{
            backgroundColor: "#2c1d13",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #a37135",
            maxWidth: "500px",
            marginTop: "30px",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}
