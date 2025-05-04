
import React from 'react';

interface ClaimFrameProps {
  userName: string;
  tokenURI: string;
}

const ClaimFrame: React.FC<ClaimFrameProps> = ({ userName, tokenURI }) => {
  return (
    <div>
      <html>
        <head>
          <meta property="og:title" content="🎉 Claim Your NFT Reward!" />
          <meta property="og:image" content="findimageforrewad.png" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="findimageforrewad.png" />
          <meta property="fc:frame:button:1" content="Claim Now" />
          <meta property="fc:frame:post_url" content="https://findimageforrewad/api/claim-reward" />
        </head>
        <body>
          <div>
            <p>User: {userName}</p>
            <p>Token URI: {tokenURI}</p>
          </div>
          <div>Reward Frame</div>
        </body>
      </html>
    </div>
  );
};

export default ClaimFrame;
