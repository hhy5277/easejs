/**
 * Tests extending of interfaces
 *
 *  Copyright (C) 2010 Mike Gerwitz
 *
 *  This file is part of ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify it under the
 *  terms of the GNU Lesser General Public License as published by the Free
 *  Software Foundation, either version 3 of the License, or (at your option)
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 *  for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author  Mike Gerwitz
 * @package test
 */

require( './common' );

var assert         = require( 'assert' ),
    Interface      = require( 'interface' ),
    abstractMethod = Interface.abstractMethod;


assert.throws( function()
{
    Interface.extend(
    {
        // properties (non-methods) are not permitted
        prop: 'not permitted',
    });
}, Error, "Properties are not permitted within Interface definitions" );

assert.throws( function()
{
    Interface.extend(
    {
        // concrete method
        method: function() {}
    });
}, Error, "Concrete methods are not permitted within Interface definitions" );

assert.doesNotThrow(
    function()
    {
        Interface.extend(
        {
            method: abstractMethod(),
        });
    },
    Error,
    "Abstract method declarations are allowed within Interface definitions"
);


var BaseType = Interface.extend(
{
    method: abstractMethod(),
});

assert.ok(
    ( BaseType.prototype.method instanceof Function ),
    "Interface contains defined abstract methods"
);


var SubType = Interface.extend( BaseType, {} );

assert.ok(
    ( SubType instanceof BaseType ),
    "Generic interface extend method can extend from other interfaces"
);

