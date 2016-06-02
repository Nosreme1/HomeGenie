$$.bind = function() {
    var element = $$.element;
    var context = $$.context;

    $$.userLang = HG.WebApp.Locales.GetUserLanguage();
    $$.cronUpdateTimeout = null;

    $$.cronExprText = $$.element.find('textarea[data-ui-field="cron-expr"]').on('keyup', function() {
        $$.buildCron(1000);
    });

    // ok button
    element.find('[data-ui-field=confirm-button]').on('click', function(){
        if (typeof $$.onChange == 'function') {
            var eachMinute = [];
            $$.eachMinuteGroup.find("input[type=checkbox]:checked").each(function() {
                eachMinute.push($(this).val());
            });
            var eachHour = [];
            $$.eachHourGroup.find("input[type=checkbox]:checked").each(function() {
                eachHour.push($(this).val());
            });
            var eachDayom = [];
            $$.eachDayomGroup.find("input[type=checkbox]:checked").each(function() {
                eachDayom.push($(this).val());
            });
            var eachDayow = [];
            $$.eachDayowGroup.find("input[type=checkbox]:checked").each(function() {
                eachDayow.push($(this).val());
            });
            var eachMonth = [];
            $$.eachMonthGroup.find("input[type=checkbox]:checked").each(function() {
                eachMonth.push($(this).val());
            });
            // update bound item data
            if ($$.item.Name == '') 
                $$.item.Name = $$.cronName.val();
            $$.item.CronExpression = $$._buildCron();
            $$.item.Description = $$.element.find('[data-ui-field=cron-desc]').html();
            $$.item.Data = JSON.stringify({
                itemType: $$.cronTypeSelect.val(),
                type: $$.eventType.val(),
                from: $$.dateFrom.val(),
                to: $$.dateTo.val(),
                at: $$.timeAt.val(),
                start: $$.timeStart.val(),
                end: $$.timeEnd.val(),
                occur_min_type: $$.minuteTypeSelect.val(),
                occur_min_step: $$.everyMinuteSlider.val(),
                occur_min_sel: eachMinute,
                occur_hour_type: $$.hourTypeSelect.val(),
                occur_hour_step: $$.everyHourSlider.val(),
                occur_hour_sel: eachHour,
                occur_dayom_type: $$.dayomTypeSelect.val(),
                occur_dayom_sel: eachDayom,
                occur_dayow_sel: eachDayow,
                occur_month_type: $$.monthTypeSelect.val(),
                occur_month_sel: eachMonth
            });
            $$.onChange($$.item);
            $$.onChange = null;
        }
    });
    
    // "each minute" control group
    var cg = $('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" />');
    for(var d = 0; d < 60; d++) {
        var mn = d.toString(); if (mn.length==1) mn = '0'+mn;
        var cr = $('<input type="checkbox" id="minute-n-'+mn+'" value="'+d+'" /><label for="minute-n-'+mn+'">'+mn+'</label>');
        cg.append(cr);    
    }
    element.find('[data-ui-field*="minute-tab3"]').append(cg);
    element.find('[data-ui-field*="minute-tab3"]').trigger('create');
    // cron expression type select
    $$.cronTypeSelect = element.find('[data-ui-field=cron-type-select]').on('change', function(){
        var type = $(this).val();
        element.find('[data-ui-field="date-range"]').hide(100);
        switch(type)
        {
            case '1':
                element.find('[data-ui-field="wizard-container"]').show();
                element.find('[data-ui-field="cronexpr-container"]').hide();
                break;
            case '2':
                element.find('[data-ui-field="wizard-container"]').show();
                element.find('[data-ui-field="cronexpr-container"]').hide();
                element.find('[data-ui-field="date-range"]').show(100);
                break;
            case '3':
                element.find('[data-ui-field="wizard-container"]').hide();
                element.find('[data-ui-field="cronexpr-container"]').show();
                break;
        }
        $$._buildCron();
    });
    // minute type select
    $$.minuteTypeSelect = element.find('[data-ui-field=minute-type-select]').on('change', function(){
        element.find('[data-ui-field*="minute-tab"]').hide(100);
        element.find('[data-ui-field="minute-tab'+$(this).val()+'"]').show(100);
        $$.buildCron();
    });
    // every minute value change
    $$.everyMinuteSlider = element.find('[data-ui-field="minute-tab2"]').find('input').on('change', function(){
        $$.buildCron();
    });
    // each minute selection change
    $$.eachMinuteGroup = cg.on('change', function(){
        $(this).find("input[type=checkbox]:checked").each(function() {
            // ...
        });
        $$.buildCron();
    });
    
    // hour ui
    cg = $('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" />');
    for(var d = 0; d < 24; d++) {
        var hr = d.toString(); if (hr.length==1) hr = '0'+hr;
        var cr = $('<input type="checkbox" id="hour-n-'+hr+'" value="'+d+'" /><label for="hour-n-'+hr+'">'+hr+'</label>');
        cg.append(cr);    
    }
    element.find('[data-ui-field*="hour-tab3"]').append(cg);
    element.find('[data-ui-field*="hour-tab3"]').trigger('create');
    // expression type select
    $$.hourTypeSelect = element.find('[data-ui-field=hour-type-select]').on('change', function(){
        element.find('[data-ui-field*="hour-tab"]').hide(100);
        element.find('[data-ui-field="hour-tab'+$(this).val()+'"]').show(100);
        $$.buildCron();
    });               
    // every hour value change
    $$.everyHourSlider = element.find('[data-ui-field="hour-tab2"]').find('input').on('change', function(){
        $$.buildCron();
    });
    // each hour selection change
    $$.eachHourGroup = cg.on('change', function(){
        //$(this).find("input[type=checkbox]:checked").each(function() {
        //    // ...
        //});
        $$.buildCron();
    });
    
    // day of month
    cg = $('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" />');
    for(var d = 1; d <= 31; d++) {
        var hr = d.toString(); if (hr.length==1) hr = '0'+hr;
        var cr = $('<input type="checkbox" id="dayom-n-'+hr+'" value="'+d+'" /><label for="dayom-n-'+hr+'">'+hr+'</label>');
        cg.append(cr);    
    }
    element.find('[data-ui-field*="dayom-tab2"]').append(cg);
    element.find('[data-ui-field*="dayom-tab2"]').trigger('create');        
    // day of month type select
    $$.dayomTypeSelect = element.find('[data-ui-field=dayom-type-select]').on('change', function(){
        element.find('[data-ui-field*="dayom-tab"]').hide(100);
        element.find('[data-ui-field="dayom-tab'+$(this).val()+'"]').show(100);
        $$.buildCron();
    });               
    // each day of month selection change
    $$.eachDayomGroup = cg.on('change', function(){
        //$(this).find("input[type=checkbox]:checked").each(function() {
        //    // ...
        //});
        $$.buildCron();
    });
    // each day of week selection change
    $$.eachDayowGroup = element.find('[data-ui-field="dayom-tab3"]').find('fieldset').on('change', function(){
        //$(this).find("input[type=checkbox]:checked").each(function() {
        //    // ...
        //});
        $$.buildCron();
    });
    
    // month
    // expression type select
    $$.monthTypeSelect = element.find('[data-ui-field=month-type-select]').on('change', function(){
        element.find('[data-ui-field*="month-tab"]').hide(100);
        element.find('[data-ui-field="month-tab'+$(this).val()+'"]').show(100);
        $$.buildCron();
    });
    // each month selection change
    $$.eachMonthGroup = element.find('[data-ui-field="month-tab2"]').find('fieldset').on('change', function(){
        //$(this).find("input[type=checkbox]:checked").each(function() {
        //    // ...
        //});
        $$.buildCron();
    });

    $$.timeRangeContainer = $$.element.find('div[data-ui-field="time-range"]');
    $$.timeRangeContainer.hide();
    $$.timeExactContainer = $$.element.find('div[data-ui-field="time-exact"]');
    $$.timeExactContainer.show();
    $$.occurrenceMinute = $$.element.find('div[data-ui-field="options-tabs-1"]');
    $$.occurrenceHour = $$.element.find('div[data-ui-field="options-tabs-2"]');
    $$.occurrenceDay = $$.element.find('div[data-ui-field="options-tabs-3"]');
    $$.occurrenceMinute.hide();
    $$.eventType = $$.element.find('[data-ui-field="type"]');
    $$.occurrenceHour.hide();
    $$.eventType.on('change', function() {
        if ($(this).val() == '0') {
            $$.occurrenceMinute.hide(100);
            $$.occurrenceHour.hide(100);
            $$.timeRangeContainer.hide(100);
            $$.timeExactContainer.show(100);
        } else {
            $$.occurrenceMinute.show(100);
            $$.occurrenceHour.show(100);
            $$.timeRangeContainer.show(100);
            $$.timeExactContainer.hide(100);
        }
        $$.buildCron();
    });
    $$.datePickerDiv = $$.element.find('[data-ui-field="date-picker-div"]');
    $$.datePickerDiv.hide();
    $$.datePicker = $$.element.find('[data-ui-field="date-picker"]').datebox({
        mode: "calbox",
        useLang: HG.WebApp.Utility.GetDateBoxLocale(),
        calShowWeek: true,
        useInline: true,
        hideContainer: true,
        hideInput: true,
        useButton: false,
        useClearButton: false,
        useSetButton: true,
        useHeader: false,
        overrideCalHeaderFormat: '%B',
        overrideDateFormat: '%Y-%m-%d',
        defaultValue: '12/02/73'
    }).on('change', function(){
        var v = $(this).val();
        var diplayDate = moment(v).format('MMMM D');
        $$.datePickerDiv.currentTarget.val(v);
        $$.datePickerDiv.currentTarget.html(diplayDate);
        $$.datePickerDiv.slideUp(150);
        $$.buildCron();
    });
    $$.dateFrom = $$.element.find('[data-ui-field="date-from"]').on('click', function() {
        $$.showDatePicker($(this));
    });
    $$.dateTo = $$.element.find('[data-ui-field="date-to"]').on('click', function() {
        $$.showDatePicker($(this));
    });
    $$.timeStart = $$.element.find('[data-ui-field="time-start"]').on('click', function() {
        $$.showTimePicker($(this));
    });
    $$.timeEnd = $$.element.find('[data-ui-field="time-end"]').on('click', function() {
        $$.showTimePicker($(this));
    });
    $$.timeAt = $$.element.find('[data-ui-field="time-at"]').on('click', function() {
        $$.showTimePicker($(this));
    });

    $$.timePicker = $$.element.find('[data-ui-field="time-picker"]').datebox({
        mode: "timebox",
        useLang:  HG.WebApp.Utility.GetDateBoxLocale(),
        overrideTimeOutput: '%k:%M',
        useInline: true,
        hideContainer: true,
        hideInput: true,
        useButton: false,
        useClearButton: false,
        useSetButton: true,
        useHeader: false
    }).on('change', function() {
        var v = $(this).val();
        var diplayTime = moment(v, 'HH:mm').format('LT');
        $$.datePickerDiv.currentTarget.val(v);
        $$.datePickerDiv.currentTarget.html(diplayTime);
        $$.datePickerDiv.slideUp(150);
        $$.buildCron();
    });

    $$.gfxWidth = 300;
    $$.gfxHeight = 40;
    $$.gfxYear = Raphael($$.element.find('[data-ui-field="gfx-months"]')[0], $$.gfxWidth, $$.gfxHeight);
    $$.gfxDay = Raphael($$.element.find('[data-ui-field="gfx-time"]')[0], $$.gfxWidth, $$.gfxHeight);
}

$$.open = function(name) {
    if (typeof name != 'undefined' && name != '') {
        $.mobile.loading('show');
        HG.Automation.Scheduling.Get(name, function (item) {
            if (item == '') {
                item = {
                    Name: '',
                    CronExpression: '',
                    Data: null,
                    Description: '',
                    IsEnabled: true,
                    ProgramId: ''
                }
            } else if (item.Data != null) {
                item.Data = $.parseJSON(item.Data);
            }
            if (typeof item.Data == 'undefined' || item.Data == null || typeof item.Data.type == 'undefined') {
                // allocate a new item
                item.Data = $$._createConfig();
                if (item.CronExpression != '')
                    item.Data.itemType = 3;
            }
            $$.item = item;
            $$._init();
            $$.element.popup('open');
            $.mobile.loading('hide');
        });
    }
}

$$._init = function() {
    // initial values
    $$.element.find('[data-ui-field*="-tab0"]').show();
    $$.element.find('[data-ui-field*="-tab1"]').hide();
    $$.element.find('[data-ui-field*="-tab2"]').hide();
    $$.element.find('[data-ui-field*="-tab3"]').hide();
    $$.eachMinuteGroup.find("input[type=checkbox]:checked").prop('checked', false).checkboxradio('refresh');
    $$.eachHourGroup.find("input[type=checkbox]:checked").prop('checked', false).checkboxradio('refresh');
    $$.eachDayomGroup.find("input[type=checkbox]:checked").prop('checked', false).checkboxradio('refresh');
    $$.eachDayowGroup.find("input[type=checkbox]:checked").prop('checked', false).checkboxradio('refresh');
    $$.eachMonthGroup.find("input[type=checkbox]:checked").prop('checked', false).checkboxradio('refresh');

    $$.cronName = element.find('[data-ui-field=cron-name]').val($$.item.Name);

    if ($$.item.Description == null)
        $$.item.Description = '';
    if ($$.item.CronExpression == null)
        $$.item.CronExpression = '';
    $$.element.find('[data-ui-field=cron-desc]').html($$.item.Description);
    $$.element.find('textarea[data-ui-field="cron-expr"]').val($$.item.CronExpression);

    $$.cronTypeSelect.val($$.item.Data.itemType).trigger('change');

    $$.dateFrom.val($$.item.Data.from);
    $$.dateFrom.html(moment($$.item.Data.from).format('MMMM D'));
    $$.dateTo.val($$.item.Data.to);
    $$.dateTo.html(moment($$.item.Data.to).format('MMMM D'));
    $$.eventType.val($$.item.Data.type).trigger('change');
    $$.timeAt.val($$.item.Data.at);
    $$.timeAt.html(moment($$.item.Data.at, 'HH:mm').format('LT'));
    $$.timeStart.val($$.item.Data.start);
    $$.timeStart.html(moment($$.item.Data.start, 'HH:mm').format('LT'));
    $$.timeEnd.val($$.item.Data.end);
    $$.timeEnd.html(moment($$.item.Data.end, 'HH:mm').format('LT'));

    // occurrence 
    $$.minuteTypeSelect.val($$.item.Data.occur_min_type).selectmenu().trigger('change');
    $$.hourTypeSelect.val($$.item.Data.occur_hour_type).selectmenu().trigger('change');
    $$.dayomTypeSelect.val($$.item.Data.occur_dayom_type).selectmenu().trigger('change');
    $$.monthTypeSelect.val($$.item.Data.occur_month_type).selectmenu().trigger('change');
    $$.eachMinuteGroup.find("input[type=checkbox]").each(function() {
        if ($$.item.Data.occur_min_sel.indexOf($(this).val()) >= 0)
            $(this).prop('checked', true).checkboxradio('refresh');
    });
    $$.everyMinuteSlider.val($$.item.Data.occur_min_step).slider('refresh');
    $$.eachHourGroup.find("input[type=checkbox]").each(function() {
        if ($$.item.Data.occur_hour_sel.indexOf($(this).val()) >= 0)
            $(this).prop('checked', true).checkboxradio('refresh');
    });
    $$.everyHourSlider.val($$.item.Data.occur_hour_step).slider('refresh');
    $$.eachDayomGroup.find("input[type=checkbox]").each(function() {
        if ($$.item.Data.occur_dayom_sel.indexOf($(this).val()) >= 0)
            $(this).prop('checked', true).checkboxradio('refresh');
    });
    $$.eachDayowGroup.find("input[type=checkbox]").each(function() {
        if ($$.item.Data.occur_dayow_sel.indexOf($(this).val()) >= 0)
            $(this).prop('checked', true).checkboxradio('refresh');
    });
    $$.eachMonthGroup.find("input[type=checkbox]").each(function() {
        if ($$.item.Data.occur_month_sel.indexOf($(this).val()) >= 0)
            $(this).prop('checked', true).checkboxradio('refresh');
    });

    $$.buildCron();

    setTimeout(function(){
        if ($$.item.Description.trim() != '')
            $$.element.find('[data-ui-field=cron-desc]').html($$.item.Description);
        if ($$.item.CronExpression.trim() != '')
            $$.element.find('textarea[data-ui-field="cron-expr"]').val($$.item.CronExpression);
    }, 100);
}

$$._createConfig = function() {
    return {
        type: 1,
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        at: moment().format('HH:mm'),
        start: moment().format('HH:mm'),
        end: moment().format('HH:mm'),
        occur_min_type: 1,
        occur_min_step: 1,
        occur_min_sel: [],
        occur_hour_type: 1,
        occur_hour_step: 1,
        occur_hour_sel: [],
        occur_dayom_type: 1,
        occur_dayom_sel: [],
        occur_dayow_sel: [],
        occur_month_type: 1,
        occur_month_sel: [],
    };
}

$$.showDatePicker = function(el) {
    $$.datePickerDiv.currentTarget = el;
    $$.timePicker.parent().parent().next().hide();
    $$.datePicker.parent().parent().next().show();
    $$.datePicker.datebox('setTheDate', moment(el.val(), 'YYYY-MM-DD').toDate());
    $$.datePickerDiv.slideDown(100);
}

$$.showTimePicker = function(el) {
    $$.datePickerDiv.currentTarget = el;
    $$.timePicker.parent().parent().next().show();
    $$.datePicker.parent().parent().next().hide();
    $$.timePicker.datebox('setTheDate', moment(el.val(), 'HH:mm').toDate());
    $$.datePickerDiv.slideDown(100);
}

$$.buildCron = function(delay) {
    if ($$.cronUpdateTimeout != null)
        clearTimeout($$.cronUpdateTimeout);
    $$.cronUpdateTimeout = setTimeout($$._buildCron, typeof delay != 'undefined' ? delay : 10);
}

$$.updateGfx = function(gfx, from, to, max, scaleMax, offset, labelFn) {
    // Update gfx
    gfx.clear();
    // month labels
    for (var m = 0; m < scaleMax; m++) {
        gfx.text(m*($$.gfxWidth/scaleMax)+4, 8, labelFn(m)).attr({fill:'white'});
    }
    gfx.rect(0, $$.gfxHeight/2, $$.gfxWidth, $$.gfxHeight).attr({
        fill: "rgba(100, 100, 100, 50)", 
        stroke: "rgb(0,0,0)",
        "stroke-width": 2
    });
    var sx = from*($$.gfxWidth/max);
    var ex = to*($$.gfxWidth/max);
    if (sx > ex) {
        gfx.rect(0, $$.gfxHeight/2, ex, $$.gfxHeight).attr({
            fill: "rgba(0, 255, 0, 50)", 
            stroke: "rgb(255,255,255)",
            "stroke-width": 1
        });
        gfx.rect(sx, $$.gfxHeight/2, $$.gfxWidth-sx, $$.gfxHeight).attr({
            fill: "rgba(0, 255, 0, 50)", 
            stroke: "rgb(255,255,255)",
            "stroke-width": 1
        });
    } else {
        gfx.rect(sx, $$.gfxHeight/2, ex-sx+3, $$.gfxHeight).attr({
            fill: "rgba(0, 255, 0, 50)", 
            stroke: "rgb(255,255,255)",
            "stroke-width": 1
        });
    }
}

$$.getMonthCron = function(dateFrom, dateTo, dayOccur, monthOccur) {
    var cronItems = [];
    var mf = moment(dateFrom).month()+1;
    var df = moment(dateFrom).date();
    var mt = moment(dateTo).month()+1;
    var dt = moment(dateTo).date();
    var cron = '';
    if (mf == mt && dt >= df) {
        cron = '* * '+df+(df!=dt?'-'+dt:'')+' '+mf+' *';
        cronItems.push(cron);
    } else {
        cron = '* * '+df+(df!=31?'-31':'')+' '+mf+' *';
        cronItems.push(cron);
        cron = '* * '+(df!=1?'1-':'')+dt+' '+mt+' *';
        cronItems.push(cron);
        if (mf > mt || mt-mf > 1 || (mf == mt && dt < df)) {
            var mfn = mf<11 ? mf+1 : 0;
            var mtp = mt>0 ? mt-1 : 11;            
            cron = '* * * '+mfn+(mfn!=mtp?'-'+mtp:'')+' *';
            cronItems.push(cron);
        }
    }
    return cronItems;
}

$$.getDayMinute = function(time) {
    var mmt = moment(time, 'HH:mm');
    var midnight = mmt.clone().startOf('day');
    return mmt.clone().diff(midnight, 'minutes');
}

$$.getTimeCron = function(timeFrom, timeTo, minOccur, hourOccur) {
    var cronItems = [];
    var hf = parseInt(timeFrom.substring(0, 2));
    var mf = parseInt(timeFrom.substring(3,5));
    var ht = parseInt(timeTo.substring(0, 2));
    var mt = parseInt(timeTo.substring(3,5));
    var cron = '';
    if (hf+':'+mf == ht+':'+mt) {            
        cron = mf+' '+hf+' * * *';
        cronItems.push(cron);
    } else {
        var min = minOccur.replace('*',''); if (min != '' && !min.startsWith('/')) min = ','+min;
        var hour = hourOccur.replace('*',''); if (hour != '' && !hour.startsWith('/')) hour = ','+hour;
        if (hf == ht && mt >= mf) {
            cron = mf+'-'+mt+min+' '+hf+hour+' * * *';
            cronItems.push(cron);
        } else {
            cron = mf+(mf!=59?'-59':'')+min+' '+hf+hour+' * * *';
            cronItems.push(cron);
            cron = (mt!=0?'00-':'')+mt+min+' '+ht+hour+' * * *';
            cronItems.push(cron);
            if (hf > ht || ht-hf > 1 || (hf == ht && mt < mf)) {
                var hfn = hf<23 ? hf+1 : 0;
                var htp = ht>0 ? ht-1 : 23;
                cron = minOccur+' '+hfn+(hfn!=htp?'-'+htp:'')+hour+' * * *';
                cronItems.push(cron);
            }
        }
    }
    return cronItems;
}

$$._buildCron = function() {
    // custom cron expression
    if ($$.cronTypeSelect.val() == '3') {
        // Update the human readable output
        $.get('/api/HomeAutomation.HomeGenie/Automation/Scheduling.Describe/'+encodeURIComponent($$.cronExprText.val()), function(res){
            if (res.ResponseValue != '')
                $$.element.find('[data-ui-field=cron-desc]').html(res.ResponseValue);
        });
        return $$.cronExprText.val();
    }
    // Build the "Occur" cron expresison first
    // Occur - minute field
    var min = '';
    var selection = $$.minuteTypeSelect.val();
    if (selection == 1) {
        min = '*';
    } else if (selection == 2) {
        min = '*/'+$$.everyMinuteSlider.val();
    } else if (selection == 3) {
        $$.eachMinuteGroup.find("input[type=checkbox]:checked").each(function() {
            min += $(this).val()+',';
        });
        if (min == '')
            min = '*';
        else
            min = min.substring(0, min.length -1);
    }
    // Occur - hour field
    var hour = '';
    var selection = $$.hourTypeSelect.val();
    if (selection == 1) {
        hour = '*';
    } else if (selection == 2) {
        hour = '*/'+$$.everyHourSlider.val();
    } else if (selection == 3) {
        $$.eachHourGroup.find("input[type=checkbox]:checked").each(function() {
            hour += $(this).val()+',';
        });
        if (hour == '')
            hour = '*';
        else
            hour = hour.substring(0, hour.length -1);
    }
    // Occur - dayom and dayw fields
    var dayom = '';
    var dayow = '';
    var selection = $$.dayomTypeSelect.val();
    if (selection == 1) {
        dayom = '*';
        dayow = '*';
    } else if (selection == 2) {
        dayow = '*';
        $$.eachDayomGroup.find("input[type=checkbox]:checked").each(function() {
            dayom += $(this).val()+',';
        });
        if (dayom == '')
            dayom = '*';
        else
            dayom = dayom.substring(0, dayom.length -1);
    } else if (selection == 3) {
        dayom = '*';
        $$.eachDayowGroup.find("input[type=checkbox]:checked").each(function() {
            dayow += $(this).val()+',';
        });
        if (dayow == '')
            dayow = '*';
        else
            dayow = dayow.substring(0, dayow.length -1);
    }
    // Occur - month field
    var month = '';
    var selection = $$.monthTypeSelect.val();
    if (selection == 1) {
        month = '*';
    } else if (selection == 2) {
        $$.eachMonthGroup.find("input[type=checkbox]:checked").each(function() {
            month += $(this).val()+',';
        });
        if (month == '')
            month = '*';
        else
            month = month.substring(0, month.length -1);
    }

    var mode = $$.eventType.val();
    // mode == '0' -> exact time, mode == '1' -> time range
    if (mode == '0') {
        $$.timeStart.val($$.timeAt.val()).html($$.timeAt.val());
        $$.timeEnd.val($$.timeAt.val()).html($$.timeAt.val());
    }

    var cronTime = $$.getTimeCron($$.timeStart.val(), $$.timeEnd.val(), min, hour);
    var cronMonth = $$.getMonthCron($$.dateFrom.val(), $$.dateTo.val(), dayom, month);

    var emptyOccur = '* * * * *';
    if (mode == '0' || $$.timeStart.val() == $$.timeEnd.val()) {
        min = '*';
        hour = '*';
    }
    var cronOccur = min+' '+hour+' '+ dayom + ' ' + month + ' ' + dayow;

    $$.updateGfx($$.gfxYear, moment($$.dateFrom.val()).dayOfYear(), moment($$.dateTo.val()).dayOfYear(), 366, 12, 1, function(m){
        return ' ... '+moment().month(m).format('MMM');
    });

    var ts = $$.getDayMinute($$.timeStart.val());
    var te = $$.getDayMinute($$.timeEnd.val());
    $$.updateGfx($$.gfxDay, ts, te, 1440, 24, 0, function(h){
        return ' . '+(h%2==0?h:'')+' . ';
    });

    // Update the human readable output
    $.get('/api/HomeAutomation.HomeGenie/Automation/Scheduling.Describe/'+encodeURIComponent(cronOccur), function(res){
        var desc = '';
        if ($$.dateFrom.val() == $$.dateTo.val()) {
            desc+= 'on '+moment($$.dateFrom.val()).format('MMMM DD');
        } else {
            desc+= 'from '+moment($$.dateFrom.val()).format('MMMM DD');
            desc+= ' to '+moment($$.dateTo.val()).format('MMMM DD');
        }
        if ($$.timeStart.val() == $$.timeEnd.val()) {
            desc+= ' at '+moment($$.timeEnd.val(), 'HH:mm').format('LT');
        } else {
            desc+= ', starting at '+moment($$.timeStart.val(), 'HH:mm').format('LT');
            desc+= ' and ending at '+moment($$.timeEnd.val(), 'HH:mm').format('LT');
        }
        if ($$.timeStart.val() == $$.timeEnd.val()) {
            if (cronOccur != emptyOccur)
                desc+= ', '+res.ResponseValue.substring(res.ResponseValue.indexOf(',')+1);
        } else
            desc+= ', '+res.ResponseValue;
        $$.element.find('[data-ui-field=cron-desc]').html(desc);
    });

    // Build the final composite cron expression
    var cronexpr = '';
    var cm = '';
    $.each(cronMonth, function(k,v) {
        cm+='('+v+') : '; 
    });
    cm = cm.substring(0, cm.length-3);
    var ct = '';
    $.each(cronTime, function(k,v) {
        ct+='('+v+') : '; 
    });
    ct = ct.substring(0, ct.length-3);
    if (cronOccur != emptyOccur)
        cronexpr = '(' + cronOccur + ') ; [ '+cm+' ] ; [ '+ct+' ]';
    else
        cronexpr = '[ '+cm+' ] ; [ '+ct+' ]';
    $$.element.find('textarea[data-ui-field="cron-expr"]').val(cronexpr);

    return cronexpr;
}