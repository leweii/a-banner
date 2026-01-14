'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef, useImperativeHandle, forwardRef } from 'react';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

export interface CaptchaHandle {
  reset: () => void;
}

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(({ onVerify, onExpire }, ref) => {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

  useImperativeHandle(ref, () => ({
    reset: () => {
      captchaRef.current?.resetCaptcha();
    },
  }));

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
});

Captcha.displayName = 'Captcha';

export default Captcha;
