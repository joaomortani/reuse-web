import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function TradesPage() {
  return (
    <div className="profile-page">
      <header className="items-page__header">
        <div>
          <h2>Trocas</h2>
          <p>Acompanhe as propostas de troca recebidas e enviadas.</p>
        </div>
      </header>
      <Alert variant="info" title="Em breve">
        Estamos finalizando a integração das trocas no backend. Enquanto isso, organize seus itens e prepare propostas incríveis!
      </Alert>
      <Button variant="ghost" disabled>
        Propor nova troca
      </Button>
    </div>
  );
}
