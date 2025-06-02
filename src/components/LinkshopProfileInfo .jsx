import styled from 'styled-components';

import Likes from './Likes';
import ProfileImage from './ProfileImage';
import { applyFontStyles } from '../styles/mixins';
import { ColorTypes, FontTypes } from '../styles/theme';

const StLinkshopProfileInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  & > * {
    flex-grow: 0;
  }
`;

const StLinkshopNameAndIdWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex-grow: 1;
`;

const StName = styled.span`
  ${applyFontStyles(FontTypes.SEMIBOLD17)}
  font-size: 1.125rem; // theme에 없음
`;
const StUserId = styled.span`
  color: ${({ theme }) => theme.colors[ColorTypes.SECONDARY_GRAY_300]};
`;

const StLikes = styled(Likes)`
  align-self: flex-start;
`;

const LinkshopProfileInfo = ({
  onClick: handleClick,
  name,
  userId,
  imageUrl,
  likes,
  isLiked,
}) => {
  return (
    <StLinkshopProfileInfoWrapper>
      <ProfileImage src={imageUrl} />
      <StLinkshopNameAndIdWrapper>
        <StName>{name}</StName>
        <StUserId>{'@' + userId}</StUserId>
      </StLinkshopNameAndIdWrapper>
      <StLikes onClick={handleClick} likes={likes} isLiked={isLiked} />
    </StLinkshopProfileInfoWrapper>
  );
};

export default LinkshopProfileInfo;
