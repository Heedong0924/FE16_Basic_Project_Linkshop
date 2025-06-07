import { createGlobalStyle } from 'styled-components';

import { applyFontStyles } from './mixins';
import theme, { ColorTypes, FontTypes } from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: Pretendard ,'Noto Sans KR', sans-serif;
    ${applyFontStyles(FontTypes.REGULAR16, ColorTypes.SECONDARY_BLACK)}
    line-height: 1.5;
    word-break: keep-all;
  }

  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  ul, ol {
    list-style: none; 
  }

  img {
    display: block; /* 인라인 요소의 하단 여백 제거 */
    max-width: 100%; /* 부모 너비에 맞춰 크기 조정 */
    height: auto; /* 이미지 비율 유지 */
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit; 
    line-height: inherit;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
  }

  button {
    cursor: pointer;
  }

  .common-modal-overlay {
    position: fixed; /* 뷰포트에 고정 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000; /* 다른 요소들 보다 위에 오도록 배치 */
    background-color: rgba(0, 0, 0, 0.7);
  }

  .common-modal-content {
    position: relative; /* 내부에 다른 요소들을 absolute로 배치할 때 기준 */
    top: 50%; /* 수직 중앙 정렬을 위해 */
    left: 50%; /* 수평 중앙 정렬을 위해 */
    transform: translate(-50%, -50%); /* 정확한 중앙 정렬, 랜딩 페이지 모바일 뷰에서는 변경필요 */
    z-index: 1001; /* 오버레이보다 높게 설정 */
    background-color: ${theme.colors.secWhite50};
    border-radius: 30px;
  }

  .confirm-create-modal {
    width: 343px;
    height: 172px;
    padding-top: 54px;
  }
`;

export default GlobalStyle;
