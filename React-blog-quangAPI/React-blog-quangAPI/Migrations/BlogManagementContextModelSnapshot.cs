﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using React_blog_quangAPI.Data.Models;

#nullable disable

namespace React_blog_quangAPI.Migrations
{
    [DbContext(typeof(BlogManagementContext))]
    partial class BlogManagementContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Blog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("Date")
                        .HasColumnType("datetime");

                    b.Property<string>("Detail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("IdType")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool?>("State")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("IdType");

                    b.ToTable("Blog", (string)null);
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.BlogLocation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("IdBlog")
                        .HasColumnType("int");

                    b.Property<int?>("IdLocation")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("IdBlog");

                    b.HasIndex("IdLocation");

                    b.ToTable("BlogLocations");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Location", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Type", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Types");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Blog", b =>
                {
                    b.HasOne("React_blog_quangAPI.Data.Models.Type", "IdTypeNavigation")
                        .WithMany("Blogs")
                        .HasForeignKey("IdType")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("IdTypeNavigation");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.BlogLocation", b =>
                {
                    b.HasOne("React_blog_quangAPI.Data.Models.Blog", "IdBlogNavigation")
                        .WithMany("BlogLocations")
                        .HasForeignKey("IdBlog")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("React_blog_quangAPI.Data.Models.Location", "IdLocationNavigation")
                        .WithMany("BlogLocations")
                        .HasForeignKey("IdLocation")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("IdBlogNavigation");

                    b.Navigation("IdLocationNavigation");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Blog", b =>
                {
                    b.Navigation("BlogLocations");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Location", b =>
                {
                    b.Navigation("BlogLocations");
                });

            modelBuilder.Entity("React_blog_quangAPI.Data.Models.Type", b =>
                {
                    b.Navigation("Blogs");
                });
#pragma warning restore 612, 618
        }
    }
}
