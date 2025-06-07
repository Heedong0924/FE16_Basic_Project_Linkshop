import styled from 'styled-components';

import BaseButton from './PrimaryButton';
import BaseModal from '../layouts/BaseModal';
import { applyFontStyles } from '../styles/mixins';
import { FontTypes } from '../styles/theme';

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  ${applyFontStyles(FontTypes.REGULAR17)};
`;

const ConfirmCreateModal = ({
  isOpen,
  onConfirm,
  message = '등록이 완료되었습니다.',
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      className='common-modal-content confirm-create-modal'
    >
      <FlexDiv>
        {message}
        <BaseButton
          width='160px'
          height='50px'
          $fontType={FontTypes.SEMIBOLD17}
          onClick={onConfirm}
        >
          확인
        </BaseButton>
      </FlexDiv>
    </BaseModal>
  );
};

export default ConfirmCreateModal;
