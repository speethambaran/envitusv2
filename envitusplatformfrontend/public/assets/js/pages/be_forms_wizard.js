/*!
 * Codebase - v3.4.0
 * @author pixelcave - https://pixelcave.com
 * Copyright (c) 2020
 */
!(function (a) {
    var e = {};
    function i(r) {
        if (e[r]) return e[r].exports;
        var t = (e[r] = { i: r, l: !1, exports: {} });
        return a[r].call(t.exports, t, t.exports, i), (t.l = !0), t.exports;
    }
    (i.m = a),
        (i.c = e),
        (i.d = function (a, e, r) {
            i.o(a, e) || Object.defineProperty(a, e, { enumerable: !0, get: r });
        }),
        (i.r = function (a) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a, "__esModule", { value: !0 });
        }),
        (i.t = function (a, e) {
            if ((1 & e && (a = i(a)), 8 & e)) return a;
            if (4 & e && "object" == typeof a && a && a.__esModule) return a;
            var r = Object.create(null);
            if ((i.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: a }), 2 & e && "string" != typeof a))
                for (var t in a)
                    i.d(
                        r,
                        t,
                        function (e) {
                            return a[e];
                        }.bind(null, t)
                    );
            return r;
        }),
        (i.n = function (a) {
            var e =
                a && a.__esModule
                    ? function () {
                          return a.default;
                      }
                    : function () {
                          return a;
                      };
            return i.d(e, "a", e), e;
        }),
        (i.o = function (a, e) {
            return Object.prototype.hasOwnProperty.call(a, e);
        }),
        (i.p = ""),
        i((i.s = 22));
})({
    22: function (a, e, i) {
        a.exports = i(23);
    },
    23: function (a, e) {
        function i(a, e) {
            for (var i = 0; i < e.length; i++) {
                var r = e[i];
                (r.enumerable = r.enumerable || !1), (r.configurable = !0), "value" in r && (r.writable = !0), Object.defineProperty(a, r.key, r);
            }
        }
        var r = (function () {
            function a() {
                !(function (a, e) {
                    if (!(a instanceof e)) throw new TypeError("Cannot call a class as a function");
                })(this, a);
            }
            var e, r, t;
            return (
                (e = a),
                (t = [
                    {
                        key: "initWizardDefaults",
                        value: function () {
                            (jQuery.fn.bootstrapWizard.defaults.tabClass = "nav nav-tabs"),
                                (jQuery.fn.bootstrapWizard.defaults.nextSelector = '[data-wizard="next"]'),
                                (jQuery.fn.bootstrapWizard.defaults.previousSelector = '[data-wizard="prev"]'),
                                (jQuery.fn.bootstrapWizard.defaults.firstSelector = '[data-wizard="first"]'),
                                (jQuery.fn.bootstrapWizard.defaults.lastSelector = '[data-wizard="lsat"]'),
                                (jQuery.fn.bootstrapWizard.defaults.finishSelector = '[data-wizard="finish"]'),
                                (jQuery.fn.bootstrapWizard.defaults.backSelector = '[data-wizard="back"]');
                        },
                    },
                    {
                        key: "initWizardSimple",
                        value: function () {
                            jQuery(".js-wizard-simple").bootstrapWizard({
                                onTabShow: function (a, e, i) {
                                    var r = ((i + 1) / e.find("li").length) * 100,
                                        t = e.parents(".block").find('[data-wizard="progress"] > .progress-bar');
                                    t.length && t.css({ width: r + 1 + "%" });
                                },
                            });
                        },
                    },
                    {
                        key: "initWizardValidation",
                        value: function () {
                            var a = jQuery(".js-wizard-validation-classic-form"),
                                e = jQuery(".js-wizard-validation-material-form");
                            a.add(e).on("keyup keypress", function (a) {
                                if (13 === (a.keyCode || a.which)) return a.preventDefault(), !1;
                            });
                            var i = a.validate({
                                    errorClass: "invalid-feedback animated fadeInDown",
                                    errorElement: "div",
                                    errorPlacement: function (a, e) {
                                        jQuery(e).parents(".form-group").append(a);
                                    },
                                    highlight: function (a) {
                                        jQuery(a).closest(".form-group").removeClass("is-invalid").addClass("is-invalid");
                                    },
                                    success: function (a) {
                                        jQuery(a).closest(".form-group").removeClass("is-invalid"), jQuery(a).remove();
                                    },
                                    rules: {
                                        "wizard-validation-classic-deviceid": { required: !0, minlength: 2 },
                                        "wizard-validation-classic-type": { required: !0},
                                        "wizard-validation-classic-family": { required: !0},
                                        "wizard-validation-classic-subtype": { required: !0 },
                                        "wizard-validation-classic-timezone": { required: !0 },
                                        "wizard-validation-classic-skills": { required: !0 },
                                        "wizard-validation-classic-terms": { required: !0 },
                                    },
                                    messages: {
                                        "wizard-validation-classic-deviceid": { required: "Please enter a Device Id", minlength: "Device Id must consist of at least 2 characters" },
                                        "wizard-validation-classic-type": { required: "Please enter a type" },
                                        "wizard-validation-classic-family": "Please enter a valid family",
                                        "wizard-validation-classic-subtype": "This field is required.",
                                        "wizard-validation-classic-skills": "Please select a skill!",
                                        "wizard-validation-classic-terms": "You must agree to the service terms!",
                                    },
                                }),
                                r = e.validate({
                                    errorClass: "invalid-feedback animated fadeInDown",
                                    errorElement: "div",
                                    errorPlacement: function (a, e) {
                                        jQuery(e).parents(".form-group").append(a);
                                    },
                                    highlight: function (a) {
                                        jQuery(a).closest(".form-group").removeClass("is-invalid").addClass("is-invalid");
                                    },
                                    success: function (a) {
                                        jQuery(a).closest(".form-group").removeClass("is-invalid"), jQuery(a).remove();
                                    },
                                    rules: {
                                        "wizard-validation-material-deviceid": { required: !0, minlength: 2 },
                                        "wizard-validation-material-type": { required: !0},
                                        "wizard-validation-material-family": { required: !0 },
                                        "wizard-validation-material-subtype": { required: !0},
                                        "wizard-validation-material-timezone": { required: !0 },
                                        "wizard-validation-material-skills": { required: !0 },
                                        "wizard-validation-material-terms": { required: !0 },
                                    },
                                    messages: {
                                        "wizard-validation-material-deviceid": { required: "Please enter a device id", minlength: "Device Id must consist of at least 2 characters" },
                                        "wizard-validation-material-type": { required: "Please enter a type"},
                                        "wizard-validation-material-family": "Please enter a valid family address",
                                        "wizard-validation-material-subtype": "Let us know a few thing about yourself",
                                        "wizard-validation-material-skills": "Please select a skill!",
                                        "wizard-validation-material-terms": "You must agree to the service terms!",
                                    },
                                });
                            jQuery(".js-wizard-validation-classic").bootstrapWizard({
                                tabClass: "",
                                onTabShow: function (a, e, i) {
                                    var r = ((i + 1) / e.find("li").length) * 100,
                                        t = e.parents(".block").find('[data-wizard="progress"] > .progress-bar');
                                    t.length && t.css({ width: r + 1 + "%" });
                                },
                                onNext: function (e, r, t) {
                                    if (!a.valid()) return i.focusInvalid(), !1;
                                },
                                onTabClick: function (a, e, i) {
                                    return jQuery("a", e).blur(), !1;
                                },
                            }),
                                jQuery(".js-wizard-validation-material").bootstrapWizard({
                                    tabClass: "",
                                    onTabShow: function (a, e, i) {
                                        var r = ((i + 1) / e.find("li").length) * 100,
                                            t = e.parents(".block").find('[data-wizard="progress"] > .progress-bar');
                                        t.length && t.css({ width: r + 1 + "%" });
                                    },
                                    onNext: function (a, i, t) {
                                        if (!e.valid()) return r.focusInvalid(), !1;
                                    },
                                    onTabClick: function (a, e, i) {
                                        return jQuery("a", e).blur(), !1;
                                    },
                                });
                        },
                    },
                    {
                        key: "init",
                        value: function () {
                            this.initWizardDefaults(), this.initWizardSimple(), this.initWizardValidation();
                        },
                    },
                ]),
                (r = null) && i(e.prototype, r),
                t && i(e, t),
                a
            );
        })();
        jQuery(function () {
            r.init();
        });
    },
});
