"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var EmptyObservable_1 = require('./EmptyObservable');
var isArray_1 = require('../util/isArray');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ForkJoinObservable = (function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
        _super.call(this);
        this.sources = sources;
        this.resultSelector = resultSelector;
    }
    /* tslint:enable:max-line-length */
    /**
     * Joins last values emitted by passed Observables.
     *
     * <span class="informal">Wait for Observables to complete and then combine last values they emitted.</span>
     *
     * <img src="./img/forkJoin.png" width="100%">
     *
     * `forkJoin` is an operator that takes any number of Observables which can be passed either as an array
     * or directly as arguments. If no input Observables are provided, resulting stream will complete
     * immediately.
     *
     * `forkJoin` will wait for all passed Observables to complete and then it will emit an array with last
     * values from corresponding Observables. So if you pass `n` Observables to the operator, resulting
     * array will have `n` values, where first value is the last thing emitted by the first Observable,
     * second value is the last thing emitted by the second Observable and so on. That means `forkJoin` will
     * not emit more than once and it will complete after that. If you need to emit combined values not only
     * at the end of lifecycle of passed Observables, but also throughout it, try out {@link combineLatest}
     * or {@link zip} instead.
     *
     * In order for resulting array to have the same length as the number of input Observables, whenever any of
     * that Observables completes without emitting any value, `forkJoin` will complete at that moment as well
     * and it will not emit anything either, even if it already has some last values from other Observables.
     * Conversely, if there is an Observable that never completes, `forkJoin` will never complete as well,
     * unless at any point some other Observable completes without emitting value, which brings us back to
     * the previous case. Overall, in order for `forkJoin` to emit a value, all Observables passed as arguments
     * have to emit something at least once and complete.
     *
     * If any input Observable errors at some point, `forkJoin` will error as well and all other Observables
     * will be immediately unsubscribed.
     *
     * Optionally `forkJoin` accepts project function, that will be called with values which normally
     * would land in emitted array. Whatever is returned by project function, will appear in output
     * Observable instead. This means that default project can be thought of as a function that takes
     * all its arguments and puts them into an array. Note that project function will be called only
     * when output Observable is supposed to emit a result.
     *
     * @example <caption>Use forkJoin with operator emitting immediately</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.of(1, 2, 3, 4),
     *   Rx.Observable.of(5, 6, 7, 8)
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // [4, 8]
     * // "This is how it ends!"
     *
     *
     * @example <caption>Use forkJoin with operator emitting after some time</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.interval(1000).take(3), // emit 0, 1, 2 every second and complete
     *   Rx.Observable.interval(500).take(4) // emit 0, 1, 2, 3 every half a second and complete
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // [2, 3] after 3 seconds
     * // "This is how it ends!" immediately after
     *
     *
     * @example <caption>Use forkJoin with project function</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.interval(1000).take(3), // emit 0, 1, 2 every second and complete
     *   Rx.Observable.interval(500).take(4), // emit 0, 1, 2, 3 every half a second and complete
     *   (n, m) => n + m
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // 5 after 3 seconds
     * // "This is how it ends!" immediately after
     *
     * @see {@link combineLatest}
     * @see {@link zip}
     *
     * @param {...SubscribableOrPromise} sources Any number of Observables provided either as an array or as an arguments
     * passed directly to the operator.
     * @param {function} [project] Function that takes values emitted by input Observables and returns value
     * that will appear in resulting Observable instead of default array.
     * @return {Observable} Observable emitting either an array of last values emitted by passed Observables
     * or value from project function.
     * @static true
     * @name forkJoin
     * @owner Observable
     */
    ForkJoinObservable.create = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i - 0] = arguments[_i];
        }
        if (sources === null || arguments.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        var resultSelector = null;
        if (typeof sources[sources.length - 1] === 'function') {
            resultSelector = sources.pop();
        }
        // if the first and only other argument besides the resultSelector is an array
        // assume it's been called with `forkJoin([obs1, obs2, obs3], resultSelector)`
        if (sources.length === 1 && isArray_1.isArray(sources[0])) {
            sources = sources[0];
        }
        if (sources.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        return new ForkJoinObservable(sources, resultSelector);
    };
    ForkJoinObservable.prototype._subscribe = function (subscriber) {
        return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
    };
    return ForkJoinObservable;
}(Observable_1.Observable));
exports.ForkJoinObservable = ForkJoinObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ForkJoinSubscriber = (function (_super) {
    __extends(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources, resultSelector) {
        _super.call(this, destination);
        this.sources = sources;
        this.resultSelector = resultSelector;
        this.completed = 0;
        this.haveValues = 0;
        var len = sources.length;
        this.total = len;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            var source = sources[i];
            var innerSubscription = subscribeToResult_1.subscribeToResult(this, source, null, i);
            if (innerSubscription) {
                innerSubscription.outerIndex = i;
                this.add(innerSubscription);
            }
        }
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
        var destination = this.destination;
        var _a = this, haveValues = _a.haveValues, resultSelector = _a.resultSelector, values = _a.values;
        var len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            var value = resultSelector ? resultSelector.apply(this, values) : values;
            destination.next(value);
        }
        destination.complete();
    };
    return ForkJoinSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=ForkJoinObservable.js.map