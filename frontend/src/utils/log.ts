const prefix = (msg: string, css: string) => [
  `%c[atsu] ${msg}`,
  `color:#8e7ce6;font-family:system-ui;font-size:1.1rem;font-weight:bold`,
  css,
];

const info = (...args: any[]) => {
  console.log(
    ...[
      ...prefix(
        "%c[info]",
        "color:#62b9f3;font-family:system-ui;font-size:1.1rem;font-weight:bold",
      ),
      ...args,
    ],
  );
};

const error = (...args: any[]) => {
  console.log(
    ...[
      ...prefix(
        "%c[error]",
        "color:red;font-family:system-ui;font-size:1.1rem;font-weight:bold",
      ),
      ...args,
    ],
  );
};

const warn = (...args: any[]) => {
  console.log(
    ...[
      ...prefix(
        "%c[error]",
        "color:orange;font-family:system-ui;font-size:1.1rem;font-weight:bold",
      ),
      ...args,
    ],
  );
};

const log = {
  info,
  error,
  warn,
};

export default log;
