import {AjaxStore, Grid, StringHelper} from './grid.module.js';

const store = new AjaxStore({
  createUrl: "/horse_info/",
  readUrl: "/horse_info/",
  updateUrl: "/horse_info/",
  deleteUrl: "/horse_info/",
  autoLoad: true,
  autoCommit: true,
  useRestfulMethods: true,
  httpMethods: {
    read: "GET",
    create: "POST",
    update: "PATCH",
    delete: "DELETE",
  },


});

let newHorseCount = 0;

const grid = new Grid({
  appendTo: document.body,
  features: {
    filter: true,
    stripe: true,
    summary: true,
  },

  tbar: [
    {
      type: "buttongroup",
      items: [
        {
          type: "button",
          ref: "addButton",
          color: "b-green",
          icon: "b-fa-plus-circle",
          margin: "0 8 0 0",
          text: "Add",
          tooltip: "Adds a new row (at bottom)",
          onAction: () => {
            const counter = ++newHorseCount,
              added = grid.store.add({
                name: `New horse ${counter}`,
                cls: `new_horse_${counter}`,
              });

            grid.selectedRecord = added[0];
          },
        },
        {
          type: "button",
          ref: "removeButton",
          color: "b-red",
          icon: "b-fa b-fa-trash",
          text: "Remove",
          tooltip: "Removes selected record(s)",
          onAction: () => {
            const selected = grid.selectedRecords;
            if (selected && selected.length) {
              const store = grid.store,
                nextRecord = store.getNext(selected[selected.length - 1]),
                prevRecord = store.getPrev(selected[0]);

              store.remove(selected);
              grid.selectedRecord = nextRecord || prevRecord;
            }
          },
        },
      ],
    },
    {
      type: "button",
      ref: "removeAll",
      text: "Remove all filters",
      margin: "0 5",
      onAction: () => store.clearFilters(),
    },
    {
      type: "button",
      ref: "readOnlyButton",
      text: "Read-only",
      tooltip: "Toggles read-only mode on grid",
      toggleable: true,
      icon: "b-fa-square",
      pressedIcon: "b-fa-check-square",
      onToggle: ({pressed}) => {
        addButton.disabled = grid.readOnly = pressed;
        removeButton.disabled = pressed || !grid.selectedRecords.length;
      },
    },
    {
      type: "button",
      text: "Sum selected rows",
      margin: "0 auto",
      toggleable: true,
      onToggle: "up.onSelectToggle",
    },
  ],

  store,

  columns: [
    {type: "rownumber"},
    {
      text: "Horse Name",
      field: "name",
      width: 260,
      editor: {
        type: 'textfield',
        required: true
      },
      // This column has a custom filtering function that matches whole words
      filterable: ({value, record}) =>
        Boolean(record.name.match(new RegExp(`${value}\\b`, "i"))),
      sum: "count",
      summaryRenderer: ({sum}) => `Total: ${sum}`,
    },
    {
      text: "Country",
      field: "country",
      width: 200,
      sum: (result, current, index) => {
        if (index === 0) {
          result = {};
        }

        const country = current.country;
        if (!Object.prototype.hasOwnProperty.call(result, country)) {
          result[country] = 1;
        } else {
          ++result[country];
        }

        return result;
      },
      summaryRenderer: ({sum}) => {
        let value = 0,
          mostPopularCountry = "";

        Object.keys(sum).forEach((key) => {
          if (value < sum[key]) {
            value = sum[key];
            mostPopularCountry = key;
          }
        });

        return StringHelper.xss`Most entries: ${mostPopularCountry} (${value})`;
      },
    },
    {
      text: "Trainer Name",
      field: "trainer",
      width: 250,
      sum: (result, current, index) => {
        if (index === 0) {
          result = {};
        }

        const trainer = current.trainer;
        if (!Object.prototype.hasOwnProperty.call(result, trainer)) {
          result[trainer] = 1;
        } else {
          ++result[trainer];
        }

        return result;
      },
      summaryRenderer: ({sum}) => {
        let value = 0,
          mostPopularTrainer = "";

        Object.keys(sum).forEach((key) => {
          if (value < sum[key]) {
            value = sum[key];
            mostPopularTrainer = key;
          }
        });

        return StringHelper.xss`Most entries: ${mostPopularTrainer} (${value})`;
      },
    },
    {
      type: "number",
      text: "Years Raced",
      field: "years_raced",
      width: 100,
      // Using built in summary calculations
      summaries: [
        {sum: "min", label: "Min"},
        {sum: "max", label: "Max"},
      ],
    },
    {
      type: "percent",
      text: "Win Rate",
      field: "percentage_wins",
      width: 200,
      editor: {
        type: "number",
        min: 0,
        max: 100,
      },
      sum: "average",
      summaryRenderer: ({sum}) => `Average: ${Math.round(sum)}%`,
    },
  ],
  onSelectToggle() {
    this.features.summary.selectedOnly = !this.features.summary.selectedOnly;
  },
});

const {addButton, removeButton} = grid.widgetMap;