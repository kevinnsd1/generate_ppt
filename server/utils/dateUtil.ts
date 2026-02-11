class DateUtil {
    dateNow(): number {
        var dateNow = new Date();
        return Math.ceil(dateNow.getTime() / 1000);
    }

    getYearFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var year = date.getFullYear();
        return year;
    }

    getMonthFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var month = date.getMonth() + 1;
        return month;
    }

    getDayFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var day = date.getDate();
        return day;
    }

    getHourFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var hours = date.getHours();
        return hours;
    }

    getMinuteFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var minutes = date.getMinutes();
        return minutes;
    }

    getSecondFromEpoch(epoch: number): number {
        var date = new Date(epoch * 1000);
        var seconds = date.getSeconds();
        return seconds;
    }
}

export = DateUtil;
