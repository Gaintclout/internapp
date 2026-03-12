import styled from "styled-components";

export default function HamburgerSwitch({ open, toggle }) {
  return (
    <StyledWrapper>
      <input
        className="label-check"
        id="label-check"
        type="checkbox"
        checked={open}
        onChange={toggle}
      />

      <label htmlFor="label-check" className="hamburger-label">
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;

  .label-check {
    display: none;
  }

  .hamburger-label {
    width: 32px;
    height: 24px;
    display: block;
    cursor: pointer;
    position: relative;
  }

  .hamburger-label div {
    width: 32px;
    height: 3px;
    background-color: #0a2a66; /* GAINT BLUE */
    position: absolute;
    left: 0;
    transition: all 0.3s ease;
  }

  .line1 {
    top: 0;
  }

  .line2 {
    top: 10px;
  }

  .line3 {
    top: 20px;
  }

  #label-check:checked + .hamburger-label .line1 {
    transform: rotate(45deg);
    top: 10px;
  }

  #label-check:checked + .hamburger-label .line2 {
    opacity: 0;
  }

  #label-check:checked + .hamburger-label .line3 {
    transform: rotate(-45deg);
    top: 10px;
  }
`;
