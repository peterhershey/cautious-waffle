import "../../_deck/styles/theme.css";
import "../../_deck/styles/glass.css";
import "../../_deck/styles/board.css";
import "../../_deck/styles/annotations.css";

const themeInit = `
(function(){try{
  var saved = localStorage.getItem('wipu-theme');
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var t = saved || (prefersLight ? 'light' : 'dark');
  var r = document.querySelector('.wipu-root');
  if(r) r.setAttribute('data-theme', t);
}catch(e){}})();
`;

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wipu-root" data-theme="dark" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      {children}
    </div>
  );
}
