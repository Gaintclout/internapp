import React from "react";
import styled from "styled-components";

export default function Card({ title, description }) {
  return (
    <StyledWrapper>
      <div className="box">
        <div className="content">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .box {
    position: relative;
    width: 100%;
    max-width: 260px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
  }

  /* BACK GRADIENT LAYERS */
  .box::before,
  .box::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0a2a66, #1e4db7);
    border-radius: 16px;
    transform: skewX(10deg);
    transition: 0.5s;
    z-index: 1;
  }

  .box::after {
    filter: blur(30px);
    opacity: 0.5;
  }

  .box:hover::before,
  .box:hover::after {
    transform: skewX(0deg) scale(1.08);
  }

  /* FRONT CONTENT */
  .content {
    position: relative;
    z-index: 5; /* 🔥 IMPORTANT FIX */
    width: 85%;
    height: 85%;
    background: rgba(255, 255, 255, 0.18); /* ⬅️ better contrast */
    backdrop-filter: blur(18px);
    border-radius: 16px;
    padding: 24px;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content h2 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 14px;
    color: #ffffff; /* 🔥 clear text */
  }

  .content p {
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.9); /* 🔥 readable */
  }
`;
