/**
 * Tests extending a class that mixes in traits
 *
 *  Copyright (C) 2014 Mike Gerwitz
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );
    },


    /**
     * The supertype should continue to work as it would without the
     * subtype, which means that the supertype's traits should still be
     * available. Note that ease.js does not (at least at the time of
     * writing this test) check to see if a trait is no longer accessible
     * due to overrides, and so a supertype's traits will always be
     * instantiated.
     */
    'Subtype instantiates traits of supertype': function()
    {
        var called = false;

        var T = this.Sut(
        {
            foo: function() { called = true; },
        } );

        // C is a subtype of a class that mixes in T
        var C = this.Class.use( T ).extend( {} )
            .extend(
            {
                // ensure that there is no ctor-dependent trait stuff
                __construct: function() {},
            } );

        C().foo();
        this.assertOk( called );
    },


    /**
     * Just as subtypes inherit the same polymorphisms with respect to
     * interfaces, so too should subtypes inherit supertypes' mixed in
     * traits' types.
     */
    'Subtype has same polymorphic qualities of parent mixins': function()
    {
        var T = this.Sut( {} ),
            o = this.Class.use( T ).extend( {} ).extend( {} )();

        // o's supertype mixes in T
        this.assertOk( this.Class.isA( T, o ) );
    },


    /**
     * Subtyping should impose no limits on mixins (except for the obvious
     * API compatibility restrictions inherent in OOP).
     */
    'Subtype can mix in additional traits': function()
    {
        var a = false,
            b = false;

        var Ta = this.Sut(
            {
                'public ta': function() { a = true; },
            } ),
            Tb = this.Sut(
            {
                'public tb': function() { b = true; },
            } ),
            C  = null;

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            var sup = _self.Class.use( Ta ).extend( {} );

            // mixes in Tb; supertype already mixed in Ta
            C = _self.Class.use( Tb ).extend( sup, {} );
        } );

        this.assertDoesNotThrow( function()
        {
            // ensures that instantiation does not throw an error and that
            // the methods both exist
            var o = C();
            o.ta();
            o.tb();
        } );

        // ensure both were properly called
        this.assertOk( a );
        this.assertOk( b );
    },


    /**
     * As a sanity check, ensure that subtyping does not override parent
     * type data with respect to traits.
     *
     * Note that this test makes the preceding test redundant, but the
     * separation is useful for debugging any potential regressions.
     */
    'Subtype trait types do not overwrite supertype types': function()
    {
        var Ta = this.Sut( {} ),
            Tb = this.Sut( {} ),
            C  = this.Class.use( Ta ).extend( {} ),
            o  = this.Class.use( Tb ).extend( C, {} )();

        // o's supertype mixes in Ta
        this.assertOk( this.Class.isA( Ta, o ) );

        // o mixes in Tb
        this.assertOk( this.Class.isA( Tb, o ) );
    },
} );
