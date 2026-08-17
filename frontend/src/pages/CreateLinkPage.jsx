import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Link2 } from 'lucide-react';
import Card from '../components/ui/Card';
import { Label, Input, FieldError, HelpText } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import { api, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [generateQr, setGenerateQr] = useState(false);
  const [utmOpen, setUtmOpen] = useState(false);
  const [utm, setUtm] = useState({ source: '', medium: '', campaign: '' });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/links', {
        longUrl,
        customAlias: customAlias || undefined,
        expiresInDays: expiresInDays || undefined,
        password: passwordEnabled ? password : undefined,
        generateQr,
        utm: utmOpen ? utm : undefined,
      });
      toast(`Short link created: /${res.data.link.code}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create this link.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="text-body text-gray-500 dark:text-gray-400 mb-6">Fill in the details below — only the URL is required.</p>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="longUrl">Original URL</Label>
              <Input id="longUrl" type="url" required placeholder="https://example.com/a/very/long/path" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="alias">Custom alias <span className="text-gray-400 font-normal">(optional)</span></Label>
              <div className="flex items-center gap-2">
                <span className="text-body text-gray-400 font-mono">concise.io/</span>
                <Input id="alias" placeholder="my-brand" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} />
              </div>
              <HelpText>3–32 characters: letters, numbers, "-", or "_". Leave blank to auto-generate.</HelpText>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="expires">Expiration <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input id="expires" type="number" min="1" max="3650" placeholder="Never" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} />
                <HelpText>Days until this link stops working.</HelpText>
              </div>
              <div>
                <Label>Password protection</Label>
                <div className="h-10 flex items-center">
                  <Switch checked={passwordEnabled} onChange={setPasswordEnabled} label={passwordEnabled ? 'Enabled' : 'Disabled'} id="pw-toggle" />
                </div>
                {passwordEnabled && (
                  <Input type="text" placeholder="Set a password" className="mt-2" value={password} onChange={(e) => setPassword(e.target.value)} minLength={4} required={passwordEnabled} />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <Label className="mb-0">Generate QR code</Label>
              <Switch checked={generateQr} onChange={setGenerateQr} id="qr-toggle" />
            </div>

            <div className="border-t border-gray-150 dark:border-gray-800 pt-4">
              <button type="button" onClick={() => setUtmOpen((o) => !o)} className="flex items-center justify-between w-full text-left">
                <span className="text-body font-medium text-gray-700 dark:text-gray-200">UTM parameters <span className="text-gray-400 font-normal">(optional)</span></span>
                <motion.span animate={{ rotate: utmOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.span>
              </button>
              {utmOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="grid sm:grid-cols-3 gap-3 pt-4">
                    <div>
                      <Label htmlFor="utm-source">Source</Label>
                      <Input id="utm-source" placeholder="newsletter" value={utm.source} onChange={(e) => setUtm({ ...utm, source: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="utm-medium">Medium</Label>
                      <Input id="utm-medium" placeholder="email" value={utm.medium} onChange={(e) => setUtm({ ...utm, medium: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="utm-campaign">Campaign</Label>
                      <Input id="utm-campaign" placeholder="launch" value={utm.campaign} onChange={(e) => setUtm({ ...utm, campaign: e.target.value })} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <FieldError>{error}</FieldError>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                <Link2 size={16} /> {loading ? 'Creating…' : 'Create link'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Cancel</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
