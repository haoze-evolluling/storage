const { app, session } = require('electron');

app.whenReady().then(() => {
  session.defaultSession.clearStorageData().then(() => {
    console.log('所有存储数据已清除');
  });
});