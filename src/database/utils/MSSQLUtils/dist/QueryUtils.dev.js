"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var QueryUtils =
/*#__PURE__*/
function () {
  function QueryUtils() {
    _classCallCheck(this, QueryUtils);
  }

  _createClass(QueryUtils, null, [{
    key: "login",
    value: function login(_ref) {
      var loginId = _ref.loginId,
          userId = _ref.userId;
      return "\n            EXEC\t[dbo].[sp_login]\n            @".concat(loginId ? 'LOGIN_ID' : 'USER_ID', " = ").concat(loginId ? 'N' : '', "'").concat(loginId ? loginId : userId, "'\n        ");
    }
  }, {
    key: "createUser",
    value: function createUser(_ref2) {
      var firstName = _ref2.firstName,
          lastName = _ref2.lastName,
          birthday = _ref2.birthday,
          gender = _ref2.gender,
          loginId = _ref2.loginId,
          type = _ref2.type;
      return "\n            EXEC\t[dbo].[sp_create_user]\n            @FIRST_NAME = N'".concat(firstName, "',\n            @LAST_NAME = N'").concat(lastName, "',\n            @BIRTHDAY = ").concat(birthday, ",\n            @GENDER = ").concat(gender, ",\n            @LOGIN_ID = N'").concat(loginId, "',\n            @TYPE = N'").concat(type, "'\n        ");
    }
  }, {
    key: "createSchedule",
    value: function createSchedule(_ref3) {
      var title = _ref3.title,
          description = _ref3.description,
          scheduleTime = _ref3.scheduleTime,
          userId = _ref3.userId;
      return "\n            EXEC\t[dbo].[sp_create_schedule]\n            @TITLE = N'".concat(title, "',\n            @DESCRIPTION = N'").concat(description, "',\n            @SCHEDULE_TIME = ").concat(scheduleTime, ",\n            @USER_ID = '").concat(userId, "'\n        ");
    }
  }, {
    key: "addToken",
    value: function addToken(_ref4) {
      var userId = _ref4.userId,
          loginId = _ref4.loginId,
          type = _ref4.type;
      return "\n            EXEC\t[dbo].[sp_add_token]\n            @USER_ID = '".concat(userId, "',\n            @LOGIN_ID = N'").concat(loginId, "',\n            @LOGIN_TYPE = N'").concat(type, "'\n        ");
    }
  }]);

  return QueryUtils;
}();

exports["default"] = QueryUtils;