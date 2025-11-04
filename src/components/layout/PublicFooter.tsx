export const PublicFooter = () => (
  <footer className="public-footer">
    <div className="container public-footer__content">
      <div>
        <strong>ReUse</strong>
        <p>Conectando pessoas para dar novos significados aos objetos.</p>
      </div>
      <div className="public-footer__links">
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
        <a href="#termos">Termos de uso</a>
      </div>
      <span className="public-footer__copyright">© {new Date().getFullYear()} ReUse</span>
    </div>
  </footer>
);
