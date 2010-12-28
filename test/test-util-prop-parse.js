/**
 * Tests util.propParse
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

var common = require( './common' ),
    assert = require( 'assert' ),
    util   = common.require( 'util' ),

    get_set = ( ( Object.prototype.__defineGetter__ ) ? true : false )
;

var data = {
    // scalars (properties)
    propStr:  'string',
    propBool:  true,
    propInt:   1,
    propFloat: 1.23,

    // array (property)
    propArray: [],

    // object (property)
    propObj: {},

    // concrete method
    method: function() {},

    // abstract method
    abstractMethod: util.createAbstractMethod(),
};

// only add getter/setter if it's supported by our engine
if ( get_set )
{
    data.__defineGetter__( 'someFoo', function () {} );
    data.__defineSetter__( 'someFoo', function () {} );
}


var chk_each = {};
for ( i in data )
{
    chk_each[ i ] = 1;
}


var props    = {},
    methods  = {},
    amethods = {},
    getters  = {},
    setters  = {};

util.propParse( data, {
    // run for each item in data
    each: function( name, value )
    {
        // only remove if the passed value is correct
        if ( value === data[ name ] )
        {
            delete chk_each[ name ];
        }
    },

    property: function( name, value )
    {
        props[ name ] = value;
    },

    method: function( name, method, is_abstract )
    {
        var to = ( is_abstract ) ? amethods : methods;
        to[ name ] = method;
    },

    getter: function( name, func )
    {
        getters[ name ] = func;
    },

    setter: function( name, func )
    {
        setters[ name ] = func;
    }
} );


// ensure properties were properly recognized
[ 'propStr', 'propBool', 'propInt', 'propFloat', 'propArray', 'propObj' ]
    .forEach( function( item )
    {
        assert.equal(
            props[ item ],
            data[ item ],
            "Property parser properly detects class properties"
        );
    });

assert.equal(
    methods.method,
    data.method,
    "Property parser properly detects concrete methods"
);

assert.equal(
    amethods.abstractMethod,
    data.abstractMethod,
    "Property parser properly detects abstract methods"
);

if ( get_set )
{
    assert.equal(
        getters.someFoo,
        data.__lookupGetter__( 'someFoo' ),
        "Property parser properly detects getters"
    );

    assert.equal(
        setters.someFoo,
        data.__lookupSetter__( 'someFoo' ),
        "Property parser properly detects setters"
    );
}


var chk_each_count = 0;
for ( item in chk_each )
{
    chk_each_count++;
}

assert.equal(
    chk_each_count,
    0,
    "Property parser supports passing each property to the provided function"
);


var Foo = function() {};
Foo.prototype.one = 1;

var instance = new Foo();
instance.two = 2;

var count = 0;
util.propParse( instance, {
    each: function()
    {
        count++;
    },
} );

assert.equal(
    count,
    1,
    "propParse should ignore prototype properties of instances"
);

