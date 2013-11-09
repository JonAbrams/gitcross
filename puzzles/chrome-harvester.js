(function() {
  var items = [];
  $(".follow-list-item").each(function(index, el) {
    var $el = $(el);
    items.push({
      images: $el.find('a:eq(0) img').attr('src'),
      username: $el.find('a:eq(1)').attr('href').replace(/\//g, ''),
      name: $el.find('a:eq(1)').text()
    });
  });
  console.log(JSON.stringify(items));
})();
