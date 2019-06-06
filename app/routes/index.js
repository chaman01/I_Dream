'use strict';

const adminRoutes         =           require('./adminRoutes'),
      userRoutes          =           require('./userRoutes'),
      all                 =           [].concat(adminRoutes,userRoutes);

module.exports = all;
