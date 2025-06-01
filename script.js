: (
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
      <button
        onClick={handleAnalyze}
        style={{
          background: "#e8c28c",
          color: "#3c2e1d",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        손금 분석하기
      </button>
    </>
  )}
</div>
</div>
);
}