(function($) {
Drupal.behaviors.hrJobs = {
  attach: function (context, settings) {

  JobsList = Backbone.Collection.extend({

    url: function() {
      return 'http://api.rwlabs.org/v1/jobs?query[fields][]=country&fields[include][]=url&query[value]=' + settings.hr_jobs.operation  + '&callback=?';
    },

    parse: function(response) {
      this.count = response.count;
      this.totalCount = response.totalCount;
      return response.data.fields;
    },

  });

    JobView = Backbone.View.extend({

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
        },

        loadResults: function() {
          var that = this;
          this.JobsList.fetch({
            success: function (jobs) {
              var template = _.template($('#jobs_list_view').html());
              $('#jobs-list-table tbody').append(template({jobs: jobs.models}));
              that.finishedLoading();
            },
          });
        },

        page: function(page) {
          this.loading();
          this.currentPage = page;
          this.clear();
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

    Backbone.history.start();

  }
}
})(jQuery);
