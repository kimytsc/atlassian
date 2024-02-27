// <script>fetch('//raw.githubusercontent.com/kimytsc/atlassian/main/jira/dashboard/latest.js').then(res => res.text()).then(eval);</script>
// <div>Jira API(<a href="https://docs.atlassian.com/software/jira/docs/api/REST/6.2.5" target="_blank">새창으로 바로가기</a>)를 활용하여 검색된 업무를 파악해본다.</div>

({
  currentUser: AJS.$(parent.document).find('meta[name=ajs-remote-user]').attr('content'),
  params: ((arr) => {
    var rslt = {};
    AJS.$(arr).each((idx, val) => {
      var param = val.split('=');
      rslt[param[0]] = rslt[param[0]] || param[1] || ''
    });
    return rslt
  })(window.location.search.substr(1).split('&')),
  init() {
    String.prototype.lpad = function(padLength, padString){
      var s = this;
      while(s.length < padLength)
        s = padString + s;
      return s;
    }
     
    String.prototype.rpad = function(padLength, padString){
      var s = this;
      while(s.length < padLength)
        s += padString;
      return s;
    }
  
    Date.prototype.date = function(idx, charset = 'eng'){
      var now = this;
    
      switch(idx){
        case undefined:
        case 'timestamp':return parseInt(now.getTime()/1000);
        case 'microtimestamp':return parseInt(now.getTime());
        case 'day':return now.getDay();
        case 'week':return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
        case 'w':return ['0','1','2','3','4','5','6'][now.getDay()];
        case 'W':return (function(c, i){
            switch(c){
              case 'kor': return ['일','월','화','수','목','금','토'][i];
              case 'eng':
              default: return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i];
            }
          }(charset, now.getDay()));
        default:
          idx=idx.replace(/M/g, (function(c, ampm){
            switch(c){
              case 'kor': return ampm ? '오전' : '오후';
              case 'eng':
              default: return ampm ? 'AM' : 'PM';
            }
          }(charset, now.getHours() >= 12)));
          idx=idx.replace(/Y/g, now.getFullYear());
          idx=idx.replace(/y/g, now.getFullYear().toString().substr(2,2));
          idx=idx.replace(/m/g, (now.getMonth()+1).toString().padStart(2, 0));
          idx=idx.replace(/d/g, now.getDate().toString().padStart(2, 0));
          idx=idx.replace(/H/g, now.getHours().toString().padStart(2, 0));
          idx=idx.replace(/h/g, (function(hour){
            return hour = hour>12 ? hour-12 : hour;
          }(parseInt(now.getHours()))).toString().padStart(2, 0));
          idx=idx.replace(/i/g, now.getMinutes().toString().padStart(2, 0));
          idx=idx.replace(/s/g, now.getSeconds().toString().padStart(2, 0));
          idx=idx.replace(/z/g, now.getMilliseconds().toString().padStart(3, 0));
          idx=idx.replace(/w/g, ['0','1','2','3','4','5','6'][now.getDay()]);
          idx=idx.replace(/W/g, (function(c, i){
            switch(c){
              case 'kor': return ['일','월','화','수','목','금','토'][i];
              case 'eng':
              default: return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i];
            }
          }(charset, now.getDay())));
          return idx;
      }
    }

    Date.prototype.getWeekNumberOfMonth = function() {
      var firstDay = new Date(this.date('Y-m-01')); // new Date(`${ this.getFullYear() }-01-01`);
      switch(firstDay.getDay()) {
        case 0: // 일
          firstDay = new Date(firstDay.setDate(+2)); break;
        case 1: // 월
          firstDay = new Date(firstDay.setDate(+1)); break;
        case 2: // 화
          firstDay = new Date(firstDay.setDate(0)); break;
        case 3: // 수
          firstDay = new Date(firstDay.setDate(-1)); break;
        case 4: // 목
          firstDay = new Date(firstDay.setDate(-2)); break;
        case 5: // 금
          firstDay = new Date(firstDay.setDate(+4)); break;
        case 6: // 토
          firstDay = new Date(firstDay.setDate(+3)); break;
      }

      if (firstDay <= this) {
        // 1주차 시작
        return parseInt((new Date(this.date('Y-m-d')).getTime() - firstDay.getTime()) / 1000 / 60 / 60 / 24 / 7) + 1;
      } else {
        // 작년 마지막주차
        return parseInt((firstDay.getTime() - new Date(this.date('Y-m-d')).getTime()) / 1000 / 60 / 60 / 24 / 7); // 계산 다시할 것
      }
    }

    Date.prototype.getWeekNumber = function() {
      var firstDay = new Date(this.date('Y-01-01')); // new Date(`${ this.getFullYear() }-01-01`);
      switch(firstDay.getDay()) {
        case 0: // 일
          firstDay = new Date(firstDay.setDate(+2)); break;
        case 1: // 월
          firstDay = new Date(firstDay.setDate(+1)); break;
        case 2: // 화
          firstDay = new Date(firstDay.setDate(0)); break;
        case 3: // 수
          firstDay = new Date(firstDay.setDate(-1)); break;
        case 4: // 목
          firstDay = new Date(firstDay.setDate(-2)); break;
        case 5: // 금
          firstDay = new Date(firstDay.setDate(+4)); break;
        case 6: // 토
          firstDay = new Date(firstDay.setDate(+3)); break;
      }

      if (firstDay <= this) {
        // 1주차 시작
        return parseInt((new Date(this.date('Y-m-d')).getTime() - firstDay.getTime()) / 1000 / 60 / 60 / 24 / 7) + 1;
      } else {
        // 작년 마지막주차
        return parseInt((firstDay.getTime() - new Date(this.date('Y-m-d')).getTime()) / 1000 / 60 / 60 / 24 / 7); // 계산 다시할 것
      }
    }

    Date.date = function(idx, charset = 'eng'){
      var	now = new Date();

      switch(idx){
        case undefined:
        case 'timestamp':return parseInt(now.getTime()/1000);
        case 'microtimestamp':return parseInt(now.getTime());
        case 'day':return now.getDay();
        case 'week':return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
        case 'w':return ['0','1','2','3','4','5','6'][now.getDay()];
        case 'W':return (function(c, i){
            switch(c){
              case 'kor': return ['일','월','화','수','목','금','토'][i];
              case 'eng':
              default: return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i];
            }
          }(charset, now.getDay()));
        default:
          idx=idx.replace(/M/g, (function(c, ampm){
            switch(c){
              case 'kor': return ampm ? '오전' : '오후';
              case 'eng':
              default: return ampm ? 'AM' : 'PM';
            }
          }(charset, now.getHours() >= 12)));
          idx=idx.replace(/Y/g, now.getFullYear());
          idx=idx.replace(/y/g, now.getFullYear().toString().substr(2,2));
          idx=idx.replace(/m/g, (now.getMonth()+1).toString().padStart(2, 0));
          idx=idx.replace(/d/g, now.getDate().toString().padStart(2, 0));
          idx=idx.replace(/H/g, now.getHours().toString().padStart(2, 0));
          idx=idx.replace(/h/g, (function(hour){
            return hour = hour>12 ? hour-12 : hour;
          }(parseInt(now.getHours()))).toString().padStart(2, 0));
          idx=idx.replace(/i/g, now.getMinutes().toString().padStart(2, 0));
          idx=idx.replace(/s/g, now.getSeconds().toString().padStart(2, 0));
          idx=idx.replace(/z/g, now.getMilliseconds().toString().padStart(3, 0));
          idx=idx.replace(/w/g, ['0','1','2','3','4','5','6'][now.getDay()]);
          idx=idx.replace(/W/g, (function(c, i){
            switch(c){
              case 'kor': return ['일','월','화','수','목','금','토'][i];
              case 'eng':
              default: return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i];
            }
          }(charset, now.getDay())));
          return idx;
      }
    }

    var targetWindow = parent || window;
    for (var i=0; i<targetWindow.frames.length; i++) {
      this.setup(targetWindow[i]);
    }
  },
  setup(targetWindow) {
    // this.style = AJS.$('style.my-custom-style');
    // if (this.style.length) {
    //   this.style.remove();
    // }

    AJS.$('style.custom-filter-style', targetWindow.document).remove();
    AJS.$('body', targetWindow.document).append(`<style class="custom-filter-style">
  .aui-lozenge{font-size:10px;}
  #filter-results-content p{margin-top:5px;}
  #filter-results-content .tipsy-inner{max-width:1000px;width:100%;}
  #filter-results-content .notCurrent{opacity:0.3}
  #filter-results-content .watchCurrent{opacity:1}
  #issuetable p {min-height:16px;}
  #issuetable .summary>p, .issue-table .summary>p {white-space: nowrap;}
  #issuetable .assignee, #issuetable .reporter {min-width:40px;}
  #issuetable .aui-icon-small{height:14px;width:14px;padding:0;}
  #issuetable .aui-icon-small:before{font-size:13px;margin-top:-6px;}
  .gadget #issuetable tr td p:first-child{margin-top:0px;}
  .gadget #issuetable td.summary p{margin-top:5px;}
  .gadget #issuetable td.status p span{max-width:60px;}
  .tipsy-inner{max-width:900px;}
  [data-id^="aggregatetimespent"]{border-left: 1px solid #cccccc;border-right: 1px solid #cccccc;}
  .colHeaderLink[data-id^="aggregatetimespent"]{padding:5px 1px !important;min-width:14px;text-align:center !important;}
  td[class^="aggregatetimespent"]{padding:4px 1px !important;border-left: 1px solid #cccccc;border-right: 1px solid #cccccc;}
  .bg-green{
    background-color: #14892c;
    border-color: #14892c;
    color: #fff;
  }
</style>`);
    this.getFilter(targetWindow, (((parameters) => {
      return (parameters.up_filterId || parameters.up_projectOrFilterId || '').replace(/.*-/, '')
    })(((arr) => {
        var rslt = {};
        AJS.$(arr).each((idx, val) => {
          var param = val.split('=');
          rslt[param[0]] = rslt[param[0]] || param[1] || ''
        });
        return rslt
      })(targetWindow.location.search.substr(1).split('&')))));
  },
  getFilter(targetWindow, filterId) {
    var $filterViewTable = AJS.$('.gadget .view table#issuetable', targetWindow.document);
    if (filterId) {
      if ($filterViewTable.length) {
        var $filterResultContent = AJS.$('#filter-results-content', targetWindow.document)
        if ($filterResultContent.length) {
          $filterResultContent.find('#issuetable tbody').html('');
          fetch(`/rest/api/2/filter/${ filterId }`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          })
          .then(res => res.json())
          .then(res => this.getSearch(targetWindow, res))
        }
      } else {
        setTimeout((win, id) => {
          this.getFilter.apply(this, [win, id])
        }, 1000, targetWindow, filterId);
      }
    }
  },
  getSearch(targetWindow, filter) {
    fetch('/rest/api/2/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        startAt: 0,
        maxResults: 1000,
        jql: filter.jql
      }),
    })
    .then(res => res.json())
    .then(res => this.getIssues(targetWindow, res, res.issues.length && Object.keys(res.issues[0].fields) || [], new Array().concat(
      res.issues.map(issue => issue.id), 
      res.issues.map(issue => issue.fields.parent && issue.fields.parent.id).filter(issue => !!issue),
      res.issues.map(issue => issue.fields.issuelinks && issue.fields.issuelinks.map(issuelinks => (issuelinks.inwardIssue && issuelinks.inwardIssue.id) || (issuelinks.outwardIssue && issuelinks.outwardIssue.id))).filter(issuelinks => issuelinks.length).reduce((arr, issuelinks) => {return new Array().concat(arr, issuelinks)}, []),
      res.issues.map(issue => issue.fields.subtasks && issue.fields.subtasks.map(subtask => subtask.id)).filter(subtasks => subtasks.length).reduce((arr, subtasks) => {return new Array().concat(arr, subtasks)}, [])
    )))
  },
  getIssues(targetWindow, filter, fields, issueIds){
    const subtasks = filter.issues.filter(issue => !!issue.fields.parent).reduce((issues, issue) => issues.concat(issue.id), []);
    if (issueIds.length) {
      return fetch('/rest/api/2/search', {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          startAt: 0,
          maxResults: 1000,
          fields: new Array().concat(fields, ['comment',"worklog"]),
          jql: `id in (${ issueIds.join() })`
        }),
      })
      .then(res => res.json())
      .then(res => res.issues.reduce((acc, issue) => {
        return {
          ...acc,
          worklogs: acc.worklogs.concat(issue.fields.worklog && issue.fields.worklog.worklogs || []),
          [issue.id]: issue,
        }
      }, {worklogs:[]}))
      .then(issues => this.setIssueTable(targetWindow, filter.issues.map(issue => subtasks.includes(issue.id) && issues[issue.fields.parent.id] || issue).filter(issue => !!issue), issues))
    }

    return false;
  },
  setIssueTable(targetWindow, filterIssues, issues) {
    AJS.$('.count-pagination', targetWindow.document).remove();
    var $thead = AJS.$('#issueTable thead th', targetWindow.document)
      , fields = $thead.toArray().map(o => o.getAttribute('data-id'));
    if (fields.includes('timespent')) {
      var interval = 8,
          theadIdx = fields.indexOf('timespent');
      while(!!interval-- && !AJS.$(`#issueTable thead th[data-interval="${ interval }"]`, targetWindow.document).length) {
        AJS.$(`<th class="colHeaderLink" data-id="timespent${ interval }" data-interval="${ interval }"><span title="투입된 시간">${ new Date(new Date() - (interval * 24 * 60 * 60 * 1000)).date('m.d(W)', 'kor') }</span></th>`).insertAfter(AJS.$('#issueTable thead th', targetWindow.document).eq(theadIdx))
        theadIdx++;
      }
      $thead = AJS.$('#issueTable thead th', targetWindow.document);
    }
    if (fields.includes('aggregatetimespent')) {
      var interval = 0,
          theadIdx = fields.indexOf('aggregatetimespent');
      var worklogs = issues.worklogs.map(worklog => worklog.started).sort();
                    //  .map(worklog => `${worklog}:${new Date(worklog).getFullYear()}-${new Date(worklog).getWeekNumber().toString().padStart(2, 0)}`)
      var started = ended = undefined;
      if (worklogs.length) {
        started = new Date(worklogs.shift());
        ended = new Date(worklogs.pop() || started);
        var targeted = started;
        do {
          targeted = new Date(targeted.getTime() + (7 * 24 * 60 * 60 * 1000));
          interval++;
        }while(targeted < ended);
      }
      var printMonth = false;
      while(!!interval-- && !AJS.$(`#issueTable thead th[data-interval="${ interval }"]`, targetWindow.document).length) {
        var targeted = new Date(new Date(ended) - (interval * 7 * 24 * 60 * 60 * 1000));
        AJS.$(`<th class="colHeaderLink" data-id="aggregatetimespent${ targeted.getFullYear() }${ targeted.getWeekNumber().toString().padStart(2, 0) }"><span title="${ targeted.getFullYear() }-${ targeted.getWeekNumber().toString().padStart(2, 0) }주차">${ targeted.getWeekNumber() }<br>${ printMonth == targeted.date('m') ? '&nbsp;' : parseInt(targeted.date('m')) }<br>${ targeted.getWeekNumberOfMonth() }</span></th>`).insertAfter(AJS.$('#issueTable thead th', targetWindow.document).eq(theadIdx))
        var printMonth = targeted.date('m');
        theadIdx++;
      }
      AJS.$('#issueTable thead th', targetWindow.document).eq(fields.indexOf('aggregatetimespent')).remove();
      $thead = AJS.$('#issueTable thead th', targetWindow.document);
    }
    fields = $thead.toArray().map(o => o.getAttribute('data-id'));

    var $tbody = AJS.$('#issueTable tbody', targetWindow.document);
    var issueIds = [];
    while(issue = filterIssues.shift()) {
      $tbody.find(`tr[rel=${ issue.id }]`).remove();
      $tbody.append(`<tr id="issuerow${ issue.id }" rel="${ issue.id }" data-issuekey="${ issue.key }" class="issuerow"></tr>`)
      if (issueIds.includes(issue.id)) {
        continue;
      }
      issueIds.push(issue.id);
      setTimeout((win, fields, issues, issue) => {
        this.initIssue.apply(this, [win, fields, issues, issue])
      }, 1, targetWindow, JSON.parse(JSON.stringify(fields)), issues, issue);
    }
  },
  fields: {
    icon(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }"><img src="${ field && field.iconUrl || "" }" height="16" width="16" border="0" align="absmiddle" alt="${ field && field.name || "" }" title="${ field && (field.description || field.name) || "" }"></p>`
    },
    status(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }"><span class="jira-issue-status-lozenge aui-lozenge jira-issue-status-lozenge-${ field.statusCategory.colorName } jira-issue-status-lozenge-done ${ !!myIssue ? '' : 'aui-lozenge-subtle' } jira-issue-status-lozenge-max-width-medium" data-tooltip="<span class=&quot;jira-issue-status-tooltip-title&quot;>${ field.name }</span><br><span class=&quot;jira-issue-status-tooltip-desc&quot;>${ field.description.replace(/"/g, '&quot;') }</span>" original-title="">${ field.name }</span></p>`;
    },
    link(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      var prefix = Array(depth).join('&nbsp;&nbsp;&nbsp;&nbsp;');
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ depth ? prefix + (next ? '┣ ' : '┗ ') : '' }<a class="issue-link" data-issue-key="${ issue.key }" href="/browse/${ issue.key }" target="_blank">${ issue.key }</a></p>`
    },
    datetime(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field ? `<span title="${ new Date(field).date('y.m.d M h:i', 'kor') }"><time datetime="${ field }">${ new Date(field).date('y.m.d(W)', 'kor') }</time></span>` : '&nbsp;' }</p>`
    },
    summary(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      var prefix = Array(depth).join('&nbsp;&nbsp;&nbsp;&nbsp;');
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">
        ${ depth ? prefix + (next ? '┣ ' : '┗ ') : '' }<a class="issue-link" data-issue-key="${ issue.key }" href="/browse/${ issue.key }" target="_blank">${ issue.key }</a>
        <span>${ field || '&nbsp;' }</span>
        ${ issue.fields.description ? `&nbsp;&nbsp;<span class="jira-issue-status-lozenge icon aui-icon aui-icon-small aui-iconfont-search-small icon-search" data-tooltip="<span class=&quot;jira-issue-status-tooltip-desc&quot;>${ issue.fields.description.replace(/"/g, '&quot;').replace(/(\r\n|\n|\r)/gm, '<br>') }</span>"></span>` : '' }
        ${ issue.fields.comment && issue.fields.comment.total ? `<span class="jira-issue-status-lozenge icon aui-icon aui-icon-small aui-iconfont-comment icon-comment" data-tooltip="<span class=&quot;jira-issue-status-tooltip-desc&quot;>${ issue.fields.comment.comments.map(o => [new Date(o.created).date('[Y-m-d H:i:s]'), `[${ o.author.displayName }]`, ' ', o.body.replace(/"/g, '&quot;').replace(/(\r\n|\n|\r)/gm, '<br>')].join('')).join('<br>----------------<br>') }</span>"></span>` : '' }
        ${ !myIssue && watchIssue ? ` <span class="jira-issue-status-lozenge aui-lozenge jira-issue-status-lozenge-warm-red jira-issue-status-lozenge-done jira-issue-status-lozenge-max-width-medium aui-icon-small"><span class="jira-issue-status-lozenge icon aui-icon aui-icon-small aui-iconfont-watch icon-watch" title="관찰중">&nbsp;</span></span>` : '' }
        ${ new Date() - (1 * 24 * 60 * 60 * 1000) < new Date(issue.fields.updated) ? new Date().date('Ymd') == new Date(issue.fields.updated).date('Ymd') ? new Date() - (1 * 60 * 60 * 1000) < new Date(issue.fields.updated) ? `<span class="aui-lozenge jira-issue-status-lozenge-warm-red">${ Math.floor((new Date() - new Date(issue.fields.updated)) / 60 / 1000) }분전 U</span>` : `<span class="aui-lozenge jira-issue-status-lozenge-warm-red aui-lozenge-subtle">${ Math.floor((new Date() - new Date(issue.fields.updated)) / 60 / 60 / 1000) }시간전 U</span>` : `<span class="aui-lozenge jira-issue-status-lozenge-green aui-lozenge-subtle">U</span>` : '' }
      </p>`
    },
    displayName(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      if (Array.isArray(field)) {
        return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field.map(o => o.displayName || o.name || '&nbsp;').join('<br>') }</p>`;
      } else {
        return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field && (field.displayName || field.name) || '&nbsp;' }</p>`;
      }
    },
    timespent(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      if (fieldName != 'timespent' && issue.fields.worklog && issue.fields.worklog.worklogs.length) {
        field = issue.fields.worklog.worklogs.filter(o => new Date(o.started).date('Ymd') === new Date(new Date() - (fieldName.replace('timespent', '') * 24 * 60 * 60 * 1000)).date('Ymd')).map(o => o.timeSpentSeconds).concat(0).reduce((accumulator, currentValue) => accumulator + currentValue);
      }
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field ? `${Math.floor(field / 60 / 6) / 10}h` : '&nbsp;' }</p>`;
    },
    aggregatetimespent(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      if (fieldName != 'aggregatetimespent'
       && issue.fields.worklog
       && issue.fields.worklog.worklogs.length
       && issue.fields.worklog.worklogs.map(worklog => new Date(worklog.started))
                                       .map(worklog => `${ worklog.getFullYear() }${ worklog.getWeekNumber().toString().padStart(2, 0)}`)
                                       .filter(worklog => fieldName.indexOf(worklog) !== -1).length) {
        // field = issue.fields.worklog.worklogs.filter(o => new Date(o.started).date('Ymd') === new Date(new Date() - (fieldName.replace('timespent', '') * 24 * 60 * 60 * 1000)).date('Ymd')).map(o => o.timeSpentSeconds).concat(0).reduce((accumulator, currentValue) => accumulator + currentValue);
        field = true;
        return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' } ${field ? `bg-green` : ``}" data-id="${field ? 'aggregatetimespent' : ''}">&nbsp</p>`;
      }
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field || '&nbsp;' }</p>`;
    },
    default(depth, next, issue, fieldName, field, myIssue, watchIssue) {
      return `<p class="${ !!myIssue || 'notCurrent' } ${ !!watchIssue && 'watchCurrent' }">${ field || '&nbsp;' }</p>`;
    }
  },
  initIssue(targetWindow, fields, issues, issue) {
    var $tr = AJS.$(`tr[rel=${ issue.id }]`, targetWindow.document);
    while(field = fields.shift()) {
      var innerHTML = '';
      var innerList = [];
      var subtasks = new Array().concat(issue.fields.subtasks.slice(), issue.fields.issuelinks.slice());
      var fieldsType = 'default';
      switch(true) {
        case /^priority$/.test(field):
        case /^issuetype$/.test(field):
          fieldsType = 'icon'; break;
        case /^status$/.test(field):
          fieldsType = 'status'; break;
        case /^summary$/.test(field):
          fieldsType = 'summary'; break;
        case /^issuelinks$/.test(field):
        case /^subtasks$/.test(field):
          fieldsType = 'link'; break;
        case /^assignee$/.test(field):
        case /^reporter$/.test(field):
        case /^components$/.test(field):
          fieldsType = 'displayName'; break;
        case /^created$/.test(field):
        case /^duedate$/.test(field):
        case /^resolutiondate$/.test(field):
        case /^customfield_10600$/.test(field):
          fieldsType = 'datetime'; break;
        case /^timespent$/.test(field):
        case /^timespent\d+$/.test(field):
          fieldsType = 'timespent'; break;
        case /^aggregatetimespent$/.test(field):
        case /^aggregatetimespent\d+$/.test(field):
          fieldsType = 'aggregatetimespent'; break;
      }

      var depth = 0;
      if (issue.fields.parent) {
        innerList.push(this.fields[fieldsType](depth++, false, issues[issue.fields.parent.id], field, issues[issue.fields.parent.id].fields[field], [issues[issue.fields.parent.id].fields.assignee && issues[issue.fields.parent.id].fields.assignee.name, issues[issue.fields.parent.id].fields.reporter && issues[issue.fields.parent.id].fields.reporter.name].filter(item => item === this.currentUser).length > 0, issues[issue.fields.parent.id].fields.watches.isWatching));
      }
      innerList.push(this.fields[fieldsType](depth++, false, issues[issue.id], field, issue.fields[field], [issue.fields.assignee && issue.fields.assignee.name, issue.fields.reporter && issue.fields.reporter.name].filter(item => item === this.currentUser).length > 0, issue.fields.watches.isWatching));
      while (subtasks.length) {
        var issuelink = subtasks.shift();
        issuelink = issuelink.inwardIssue || issuelink.outwardIssue || issuelink;
        if (issues[issuelink.id]) {
          innerList.push(this.fields[fieldsType](depth, subtasks.length, issues[issuelink.id], field, issues[issuelink.id].fields[field], [issues[issuelink.id].fields.assignee && issues[issuelink.id].fields.assignee.name, issues[issuelink.id].fields.reporter && issues[issuelink.id].fields.reporter.name].filter(item => item === this.currentUser).length > 0, issues[issuelink.id].fields.watches.isWatching));
        } else {
          innerList.push(this.fields[fieldsType](depth, subtasks.length, issuelink, field, issuelink.fields[field], [issuelink.fields.assignee && issuelink.fields.assignee.name, issuelink.fields.reporter && issuelink.fields.reporter.name].filter(item => item === this.currentUser).length > 0, false));
        }
      }
      innerHTML = `${ innerList.join('') }`

      $tr.append(`<td class="${ field }">${ innerHTML }</td>`);
    }
    targetWindow.gadgets.window.adjustHeight();
  }
}).init();
