(function() {
  function checkDatabaseConnection() {
    fetch('/check-db-connection')
      .then(response => response.json())
      .then(data => {
        if (data.connected) {
          if (!localStorage.getItem('redirectedToIndex')) {
            localStorage.setItem('redirectedToIndex', 'true');
            window.location.replace('/index.html');
          }
        } else {
          localStorage.removeItem('redirectedToIndex');
          window.location.replace('/checkdb.html');
        }
      })
      .catch(() => {
        localStorage.removeItem('redirectedToIndex');
        window.location.replace('/checkdb.html');
      });
  }

  setInterval(checkDatabaseConnection, 500); // Check every 5 seconds
})();
