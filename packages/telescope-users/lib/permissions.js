/**
 * Telescope permissions
 * @namespace Users.can
 */
Users.can = {};


/**
 * Permissions checks.  Return true if all is well.
 * @param {Object} user - Meteor.user()
 */
Users.can.view = function (user) {
  if (Settings.get('requireViewInvite', false)) {

    if (Meteor.isClient) {
      // on client only, default to the current user
      user = (typeof user === 'undefined') ? Meteor.user() : user;
    }

    return (!!user && (Users.isAdmin(user) || Users.isInvited(user)));
  }
  return true;
};

Users.can.viewPendingPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.isAdmin(user);
};

Users.can.viewRejectedPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.isAdmin(user);
};

Users.can.viewById = function (userId) {
  // if an invite is required to view, run permission check, else return true
  if (Settings.get('requireViewInvite', false)) {
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;
  }
  return true;
};

Users.can.post = function (user, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user) {
    return returnError ? "no_account" : false;
  } else if (Users.isAdmin(user)) {
    return true;
  } else if (Settings.get('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      return returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
};

Users.can.comment = function (user, returnError) {
  return Users.can.post(user, returnError);
};

Users.can.vote = function (user, returnError) {
  return Users.can.post(user, returnError);
};

Users.can.edit = function (user, item, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !item || (user._id !== item.userId &&
                         user._id !== item._id &&
                         !Users.isAdmin(user))) {
    return returnError ? "no_rights" : false;
  } else {
    return true;
  }
};

Users.can.editById = function (userId, item) {
  var user = Meteor.users.findOne(userId);
  return Users.can.edit(user, item);
};

Users.can.currentUserEdit = function (item) {
  return Users.can.edit(Meteor.user(), item);
};

Users.can.invite = function (user) {
  return Users.isInvited(user) || Users.isAdmin(user);
};