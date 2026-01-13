'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

export default function Captcha({ onVerify, onExpire }: CaptchaProps) {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

  return (
    <div className="flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onExpire={onExpire}
      />
    </div>
  );
}
