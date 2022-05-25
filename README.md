Скрипт будет полезен, если вы хотите:

  * С минимальными изменениями в коде сайта массово переключить чат с одного на другой;
  * Когда с кодом сайта работают не только разработчики, но и менеджеры сайта, например, в таких CMS как Bitrix, где менеджеры не работают с Git и вносят изменения повех ваших изменений.

Как использовать:

  * `listSupportedOpen` – содержит перечень виджетов с которыми предстоит работа:
    * `name` – идентификатор при клике на которых вызывается виджет;
    * `originalName` – строка кода, которая вызывает этот виджет;
    * `style` – позволят прописать css-правила действующие при смене виджета:
      * `mode` – задает режим работы:
        * `always` - отображать элемент и не применять стили;
        * `only_style` - выполнять работу только со стилями;
        * `never` - скрыть элемент и выполнять работу только со `styleFix`.
      * `className` – идентификатор ваших стилей. Оставьте пустым, если ваш сайт никак не обрабатывать селекторы `<style>`;
      * `styleFix` – пропишите css-правила корректировки, которые будут задействованы при вызове виджета;
        * `styleFixOff` – пропишите css-правила которые будут задействованы, если виджет не был вызван.
      * `oldStyleElement` и `newStyleElement` – технические ключи, для реализации логики применения стилей для виджетов, которые внешне никак не должны себя проявлять, пока не будут специально вызваны.
