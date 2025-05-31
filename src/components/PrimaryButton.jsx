import styled from 'styled-components';

import { applyFontStyles } from '../styles/mixins';
import { FontTypes, ColorTypes } from '../styles/theme';

const BaseButton = styled.button`
  border-radius: 37px;
  background-color: ${({ theme }) => theme.colors[ColorTypes.PRIMARY]};
  width: ${({ width = '98px' }) => width};
  height: ${({ height = '36px' }) => height};

  ${({
    $fontType = FontTypes.REGULAR16,
    $color = ColorTypes.SECONDARY_WHITE_50,
  }) => applyFontStyles($fontType, $color)};

  /**
    다른 컴포넌트에서 사용하실때 width값과 height값을 사용하실수 있습니다. (지정하지 않을시 기본값으로 적용됨)
    폰트 타입의 경우 theme를 임포트해 FontTypes을 지정하실수있습니다. (지정하지 않을시 REGULAR16으로 적용됨)
    이때 $fontType={FontTypes.REGULAR16} fontType 변수앞에 $기호 꼭 붙여주기
    ex)
    <BaseButton width='160px' height='50px' $fontType={FontTypes.REGULAR16}>
      생성하기
    </BaseButton>
  **/
`;

export default BaseButton;
