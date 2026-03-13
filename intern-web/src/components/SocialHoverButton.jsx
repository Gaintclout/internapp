import React from "react";
import styled from "styled-components";

const SocialHoverButton = () => {
  return (
    <StyledWrapper>
      <div className="main">
        {/* CENTER TEXT */}
        <p className="text">Institution Benefits</p>

        {/* ===== ROW 1 ===== */}
        <div className="card icon-only">⚡</div>
        <div className="card combined-text">Readiness</div>

        {/* ===== ROW 2 (OPPOSITE) ===== */}
        <div className="card combined-text">Reporting</div>
        <div className="card icon-only">📊</div>

        {/* ===== ROW 3 ===== */}
        <div className="card icon-only">🏭</div>
        <div className="card combined-text">Industry</div>
      </div>
    </StyledWrapper>
  );
};

export default SocialHoverButton;

/* ================= STYLES ================= */

const StyledWrapper = styled.div`
  .main {
    position: relative;
    width: 460px;        /* ⬆️ more wide */
    height: 420px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-family: "Century Gothic", sans-serif;
  }

  /* BASE CARD */
  .card {
    width: 120px;        /* ⬆️ increased */
    height: 120px;       /* ⬆️ increased */
    margin: 12px;
    background: #f1f5f9;
    border-radius: 20px;
    border: 2px solid #cbd5e1;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 20px;
    font-weight: 700;
    color: #0a2a66;

    transition: all 0.35s ease;

    /* hidden before hover */
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
  }

  /* SHOW ON HOVER */
  .main:hover .card {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* CARD HOVER EFFECT */
  .card:hover {
    background: #0a2a66;
    color: #ffffff;
    transform: translateY(-6px) scale(1.08);
    box-shadow: 0 18px 38px rgba(10, 42, 102, 0.35);
  }

  /* ICON ONLY CARD */
  .card.icon-only {
    font-size: 32px;
  }

  /* TEXT CARD (2 BOXES WIDTH) */
  .card.combined-text {
    width: 260px;        /* ⬆️ BIG combined width */
    font-size: 20px;
    font-weight: 700;
  }

  /* CENTER TITLE */
  .text {
    position: absolute;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-align: center;
    line-height: 1.2;
    color: #0a2a66;
    transition: opacity 0.3s ease;
  }

  .main:hover .text {
    opacity: 0;
  }
`;
