/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var chai = require('chai');
var GitBook = require('../lib/gitbook');
var fs = require('fs');


describe('GitBook', function() {
  
  describe('#chapters', function() {
    
    it('should yield chapters', function(done) {
      var GitBook = $require('../lib/gitbook', {
        'fs': {
          readFile: function(path, encoding, callback) {
            expect(path).to.equal('/tmp/book/SUMMARY.md');
            expect(encoding).to.equal('utf8');
            return fs.readFile('test/data/chapters/SUMMARY.md', 'utf8', callback);
          }
        }
      });
      
      
      var book = new GitBook('/tmp/book');
      book.chapters(function(err, chapters) {
        if (err) { return done(err); }
        
        expect(chapters).to.deep.equal([
          { title: 'Writing is nice', href: 'writing.md' },
          { title: 'GitBook is nice', href: 'gitbook.md' }
        ]);
        done();
      });
    }); // should yield chapters
    
    // https://github.com/GitbookIO/gitbook/blob/master/docs/pages.md#summary
    it('should yield chapters with subchapters', function(done) {
      var GitBook = $require('../lib/gitbook', {
        'fs': {
          readFile: function(path, encoding, callback) {
            expect(path).to.equal('/tmp/book/SUMMARY.md');
            expect(encoding).to.equal('utf8');
            return fs.readFile('test/data/subchapters/SUMMARY.md', 'utf8', callback);
          }
        }
      });
      
      var book = new GitBook('/tmp/book');
      book.chapters(function(err, chapters) {
        if (err) { return done(err); }
        
        expect(chapters).to.deep.equal([
          {
            title: 'Part I',
            href: 'part1/README.md',
            children: [
              { title: 'Writing is nice', href: 'part1/writing.md' },
              { title: 'GitBook is nice', href: 'part1/gitbook.md' }
            ]
          },
          {
            title: 'Part II',
            href: 'part2/README.md',
            children: [
              { title: 'We love feedback', href: 'part2/feedback_please.md' },
              { title: 'Better tools for authors', href: 'part2/better_tools.md' }
            ]
          }
        ]);
        done();
      });
    }); // should yield chapters with subchapters
    
    it('should yield chapters without parts', function(done) {
      var GitBook = $require('../lib/gitbook', {
        'fs': {
          readFile: function(path, encoding, callback) {
            expect(path).to.equal('/tmp/book/SUMMARY.md');
            expect(encoding).to.equal('utf8');
            return fs.readFile('test/data/parts/SUMMARY.md', 'utf8', callback);
          }
        }
      });
      
      var book = new GitBook('/tmp/book');
      book.chapters(function(err, chapters) {
        if (err) { return done(err); }
        
        expect(chapters).to.deep.equal([
          { title: 'Writing is nice', href: 'part1/writing.md' },
          { title: 'GitBook is nice', href: 'part1/gitbook.md', children: null },
          { title: 'We love feedback', href: 'part2/feedback_please.md' },
          { title: 'Better tools for authors', href: 'part2/better_tools.md', children: null },
          { title: 'Last part without title', href: 'part3/title.md' }
        ]);
        done();
      });
    }); // should yield chapters without parts
    
    it('should yield chapters with parts when include parts option is set', function(done) {
      var GitBook = $require('../lib/gitbook', {
        'fs': {
          readFile: function(path, encoding, callback) {
            expect(path).to.equal('/tmp/book/SUMMARY.md');
            expect(encoding).to.equal('utf8');
            return fs.readFile('test/data/parts/SUMMARY.md', 'utf8', callback);
          }
        }
      });
      
      var book = new GitBook('/tmp/book');
      book.chapters({ includeParts: true }, function(err, chapters) {
        if (err) { return done(err); }
        
        expect(chapters).to.deep.equal([
          { text: 'Part I' },
          [
            { title: 'Writing is nice', href: 'part1/writing.md' },
            { title: 'GitBook is nice', href: 'part1/gitbook.md', children: null }
          ],
          { text: 'Part II' },
          [
            { title: 'We love feedback', href: 'part2/feedback_please.md' },
            { title: 'Better tools for authors', href: 'part2/better_tools.md', children: null }
          ],
          { divider: true },
          [
            { title: 'Last part without title', href: 'part3/title.md' }
          ]
        ]);
        done();
      });
    }); // should yield chapters with parts when include parts option is set
    
  }); // #chapters
  
});
