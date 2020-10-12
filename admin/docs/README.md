## onka-react-admin-core

Simple admin panel based on React and Material UI.

## Installation

You can install it from npm using:

```
yarn add onka-react-admin-core
```

Simple usage;

```
function App() {
  function onload(): Promise<any> {
    StaticService.TOKEN_NAME = "AdminToken";
    ConfigService.instance().setApiUrl(config.API_URL || '');
    ConfigService.instance().setIsProd(config.IS_PROD);
    ConfigService.instance().setLangList({
      en: () => require('./ui/panel/modules/l10n/en.json'),
      tr: () => require('./ui/panel/modules/l10n/tr.json'),
    });
    return Promise.resolve();
  }
  const logo = '/images/logo.png';
  return (
    <Admin
      onLoad={onload}
      rootRoutes={[
        <Route key="0" path="/about">
          <About />
        </Route>,
      ]}
      dashboard={<Dashboard />}
      footer={<Footer />}
      toolbar={{  }}
      menu={{
        menus,
        routes: panelRoutes,
        logo
      }}
      login={{
        footer: <PublicFooter />,
        logo
      }}
    ></Admin>
  );
}
```
- [Login](Login.md)  
- [Search](List.md)  
- [Detail](Detail.md)  
- [Update/Insert](Upsert.md)  
- [Fields](Fields.md)  
- [Inputs](Inputs.md)  