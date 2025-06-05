import { useNavigate } from 'react-router-dom';
import CreateProducts from '../components/CreateProducts';
import CreateShop from '../components/CreateShop';
import { useState } from 'react';
import ConfirmCreateModal from '../components/ConfirmCreateModal';
import styled from 'styled-components';
import BaseButton from '../components/PrimaryButton';
import theme from '../styles/theme';
import { ColorTypes } from '../styles/theme';

const PageContainer = styled.div`
  width: 375px;
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 744px;
  }
`;

const STConfirmButton = styled(BaseButton)`
  width: 344px;
  height: 50px;
  margin: 0 auto 124px;
  display: block;
  background-color: ${({ disabled }) =>
    disabled === true
      ? theme.colors[ColorTypes.SECONDARY_GRAY_200]
      : theme.colors[ColorTypes.PRIMARY]};

  @media (min-width: 768px) {
    width: 696px;
  }
`;

function CreateShopPage({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setIsOpen(false);
    navigate('/list');
  };

  const handleCreate = () => {
    // 1. 데이터 저장 로직 수행 (예: API 호출)
    // await createShop(data);

    // 2. 성공 시 토스트 띄우기
    onSuccess?.();

    // 3. 모달 띄우기
    setIsOpen(true);

    // navigate('/list'); 요거는 모달로
  };

  return (
    <PageContainer>
      <CreateProducts />
      <CreateShop />
      {/* 공용 버튼 컴포넌트로 수정 필요 */}
      <STConfirmButton
        type='button'
        onClick={handleCreate}
        disabled={isDisabled}
      >
        생성하기
      </STConfirmButton>
      <ConfirmCreateModal onConfirm={handleConfirm} isOpen={isOpen} />
    </PageContainer>
  );
}

export default CreateShopPage;
