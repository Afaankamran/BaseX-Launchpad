import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #fff;
  }
`;
export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  id: string;
}) {
  const content = (
    <StyledDiv
      onClick={onClick}
      className={`flex items-center justify-between w-full p-2 mt-2 rounded cursor-pointer ${
        !active ? 'bg-dark-800 hover:bg-dark-700' : 'bg-dark-1000 border'
      }`}
    >
      <div>
        <div className="flex items-center text-white">
          {active && (
            <div
              className="w-4 h-4 mr-4 rounded-full"
              style={{ background: color }}
            />
          )}
          {header}
        </div>
        {subheader && <div className="mt-2.5 text-xs">{subheader}</div>}
      </div>
      <Image src={icon} alt={'Icon'} width="32px" height="32px" />
    </StyledDiv>
  );
  if (link) {
    return <a href={link}>{content}</a>;
  }

  return !active ? (
    content
  ) : (
    <div className="w-full p-px rounded bg-gradient-to-r from-blue to-pink">
      {content}
    </div>
  );
}
