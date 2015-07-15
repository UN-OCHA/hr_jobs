(function($) {
Drupal.behaviors.hrJobs = {
  attach: function (context, settings) {

  Job = Backbone.Model.extend({
    defaults: {
      title: '',
      url: '',
    },
  });

  JobsList = Backbone.Collection.extend({

    model: Job,
    //params: {},
    url: function() {
      return 'http://api.rwlabs.org/v1/jobs?query[fields][]=country&fields[include][]=url&query[value]=' + settings.hr_jobs.operation;
    },

    parse: function(response) {
      this.count = response.count;
      this.totalCount = response.totalCount;

      var models = response.data ? response.data : {};
      return _.map(models, function(model){
        var fields = model.fields,
        title = fields.title,
        url = fields.url;

        return (_.extend({}, fields, {title: title, url: url}));
      }, this);
    },

    limit: 5,
    skip: 0,
    count: 0,

  });

    JobView = Backbone.View.extend({

      router: null,

      clear: function() {
        this.$el.empty();
      },

      loading: function() {
        this.hide();
        $('#loading').show();
      },

      finishedLoading: function() {
        $('#loading').hide();
        this.show();
      },

    });

    JobTableView = JobView.extend({

        numItems: 10,
        currentPage: 1,

        initialize: function() {
            this.JobsList = new JobsList;
            this.JobsList.limit = this.numItems;
            this.render();
        },

        loadResults: function() {
          var that = this;
          this.JobsList.fetch({
            success: function (fields) {
              var template = _.template($('#jobs_list_view').html());
              $('#jobs-list-table tbody').append(template({fields: fields.models}));
              that.finishedLoading();
            },
          });
        },

        page: function(page) {
          this.loading();
          this.currentPage = page;
          this.clear();
          this.JobsList.skip = this.numItems * (page - 1);
          this.loadResults();
        },

        render: function (model){
          this.loadResults();
        },

        clear: function() {
          $('#jobs-list-table tbody').empty();
        },

        show: function() {
          $('#jobs-list').show();
        },

        hide: function() {
          $('#jobs-list').hide();
        },

        finishedLoading: function() {
          $('#loading').hide();
          this.show();
        },
    });

    JobsRouter = Backbone.Router.extend({
      routes: {
        "table/:page" : "table",
        "*actions": "defaultRoute",
      },

      tableView: new JobTableView({collection: JobsList, el: 'body'}),

      initialize: function() {
        this.tableView.router = this;
      },

      defaultRoute: function (actions) {
        this.navigate('table/1', {trigger: true});
      },

      table: function(page) {
        this.tableView.page(page);
      },

      navigateWithParams: function(url, params) {
        this.navigate(url + '?' + $.param(params), {trigger: true});
      },
    });
    Backbone.history.start();
    var jobs_router = new JobsRouter;

    //Backbone.history.start();

  }
}
})(jQuery);